defmodule SoziselWeb.Schema.Resolvers.ParticipantResolvers do
  alias Sozisel.Repo
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

  alias Sozisel.Model.{
    Sessions,
    Events,
    LaunchedEvents,
    Participants,
    Quizzes,
    EventResults,
    Utils,
    Whiteboards
  }

  alias Events.Event
  alias EventResults.EventResult
  alias Whiteboards.WhiteboardResult
  alias LaunchedEvents.LaunchedEvent
  alias Sessions.Session
  alias Participants.Participant
  alias Quizzes.{QuizResult, ParticipantAnswer, TrackNode}

  require Logger

  @media_storage_module Sozisel.MediaStorage.Disk

  # password is optional so we can't always pattern match on all arguments
  def join_session(
        _parent,
        %{input: %{email: email, full_name: full_name, session_id: session_id} = input},
        _ctx
      ) do
    entry_password = Map.get(input, :entry_password)

    with %Session{entry_password: ^entry_password} = session <-
           Repo.get_by(Session, id: session_id),
         {:ok} <- Sessions.participant_can_join_session(session),
         {:ok, %Participant{} = participant} <-
           Participants.create_participant(%{
             session_id: session_id,
             email: email,
             full_name: full_name
           }) do
      {:ok, %{token: participant.token}}
    else
      {:error, reason} ->
        {:error, "failed to create a participant because #{reason}"}

      _ ->
        {:error, "unauthorized"}
    end
  end

  defmacrop verify_launched_event(ctx, launched_event_id, do_block) do
    quote do
      with %LaunchedEvent{} = launched_event <-
             LaunchedEvents.get_launched_event(unquote(launched_event_id)),
           %LaunchedEvent{session: %Session{}, event: %Event{}} = launched_event <-
             Repo.preload(launched_event, [:session, :event]),
           %{context: %{session: session_ctx, participant: participant}} <- unquote(ctx),
           true <- launched_event.session.id == session_ctx.id do
        unquote(do_block).(%{
          launched_event: launched_event,
          event: launched_event.event,
          session: launched_event.session,
          participant: participant
        })
      else
        _ -> {:error, "unauthorized"}
      end
    end
  end

  def submit_poll_result(
        _parent,
        %{
          input: %{
            launched_event_id: launched_event_id,
            poll_option_ids: option_ids
          }
        },
        ctx
      ) do
    on_verified = fn %{
                       launched_event: launched_event,
                       session: session,
                       participant: participant
                     } ->
      with {:ok, event_result} <-
             EventResults.create_event_result(%{
               participant_id: participant.id,
               launched_event_id: launched_event.id,
               result_data: %{option_ids: option_ids}
             }) do
        Helpers.subscription_publish(
          :event_result_submitted,
          Topics.session_presenter(session.id, session.user_id),
          event_result
        )

        {:ok, event_result}
      end
    end

    verify_launched_event(ctx, launched_event_id, on_verified)
  end

  def submit_quiz_results(
        _parent,
        %{
          input: %{
            launched_event_id: launched_event_id,
            participant_answers: participant_answers
          }
        },
        ctx
      ) do
    on_verify = fn %{
                     launched_event: launched_event,
                     event: event,
                     participant: participant
                   } ->
      event_questions = Map.get(event.event_data, :quiz_questions)

      participant_answers =
        Enum.map(event_questions, fn event_question ->
          answer_on_question =
            participant_answers
            |> Enum.find(&(&1.question_id == event_question.id))

          if answer_on_question != nil do
            correct_answers_ids =
              event_question.correct_answers
              |> Enum.map(& &1.id)

            track_nodes =
              answer_on_question.track_nodes
              |> Enum.map(&struct(TrackNode, &1))

            points =
              if Enum.sort(answer_on_question.final_answer_ids) == Enum.sort(correct_answers_ids) do
                1
              else
                0
              end

            %ParticipantAnswer{
              question_id: event_question.id,
              final_answer_ids: answer_on_question.final_answer_ids,
              answer_time: answer_on_question.answer_time,
              points: points,
              track_nodes: track_nodes
            }
          else
            nil
          end
        end)
        |> Enum.reject(&is_nil(&1))

      with {:ok, event_result} <-
             %{
               participant_id: participant.id,
               launched_event_id: launched_event.id,
               result_data: %QuizResult{
                 participant_answers: participant_answers
               }
             }
             |> Utils.from_deep_struct()
             |> EventResults.create_event_result() do
        total_points =
          event_result.result_data.participant_answers
          |> Enum.map(& &1.points)
          |> Enum.sum()

        Helpers.subscription_publish(
          :event_result_submitted,
          Topics.session_presenter(launched_event.session.id, launched_event.session.user_id),
          %{
            id: event_result.id,
            result_data: %{
              total_points: total_points
            }
          }
        )

        {:ok, event_result}
      end
    end

    verify_launched_event(ctx, launched_event_id, on_verify)
  end

  def insert_whiteboard_result_in_transaction(event_result_attrs, image, filename, extension) do
    Ecto.Multi.new()
    |> Ecto.Multi.insert(
      :whiteboard_event_result,
      EventResult.create_changeset(%EventResult{}, event_result_attrs)
    )
    |> Ecto.Multi.run(:file_rename, fn _repo, event_result ->
      %{
        whiteboard_event_result: %{
          result_data: %{path: path}
        }
      } = event_result

      processed_image_path = Path.rootname(path) <> "_processed" <> extension

      with :ok <- File.touch(processed_image_path),
           :ok <- File.rename(image.path, processed_image_path),
           :ok <- @media_storage_module.store_file(filename, processed_image_path) do
        {:ok, %{}}
      end
    end)
    |> Repo.transaction()
  end

  def submit_whiteboard_result(_parent, data, ctx) do
    %{
      input: %{
        launched_event_id: launched_event_id,
        image: %Plug.Upload{} = image,
        text: text,
        used_time: used_time
      }
    } = data

    on_verified = fn %{
                       launched_event: launched_event,
                       session: session,
                       participant: participant
                     } ->
      extension = Path.extname(image.filename)
      filename = WhiteboardResult.generate_filename(launched_event.id, participant.id, extension)

      event_result_attrs = %{
        participant_id: participant.id,
        launched_event_id: launched_event.id,
        result_data: %{
          path: filename,
          text: text,
          used_time: used_time
        }
      }

      with %LaunchedEvent{event_id: event_id} <- Repo.get(LaunchedEvent, launched_event_id),
           %Event{event_data: %event_data_module{} = event_data} <- Repo.get(Event, event_id),
           :ok <- event_data_module.validate_result(event_data, event_result_attrs) do
        insert_whiteboard_result_in_transaction(event_result_attrs, image, filename, extension)
        |> case do
          {:ok, %{whiteboard_event_result: event_result}} ->
            Helpers.subscription_publish(
              :event_result_submitted,
              Topics.session_presenter(session.id, session.user_id),
              %{
                id: event_result.id,
                result_data: %WhiteboardResult{
                  path: filename,
                  text: text,
                  used_time: used_time
                }
              }
            )

            {:ok, event_result}

          {:error, operation, value, _others} ->
            Logger.error("Failed to upload image: #{inspect(operation)}, #{inspect(value)}")
            {:error, "failed to upload image"}
        end
      end
    end

    verify_launched_event(ctx, launched_event_id, on_verified)
  end
end
