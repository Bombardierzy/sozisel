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
    Utils
  }

  alias Events.Event
  alias LaunchedEvents.LaunchedEvent
  alias Sessions.Session
  alias Participants.Participant
  alias Quizzes.{QuizResult, ParticipantAnswer, TrackNode}

  require Logger

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

          correct_answers_ids =
            event_question.correct_answers
            |> Enum.map(& &1.id)

          track_nodes =
            answer_on_question.track_nodes
            |> Enum.map(&struct(TrackNode, &1))

          %ParticipantAnswer{
            question_id: event_question.id,
            final_answer_ids: answer_on_question.final_answer_ids,
            is_correct:
              Enum.sort(answer_on_question.final_answer_ids) == Enum.sort(correct_answers_ids),
            track_nodes: track_nodes
          }
        end)

      with {:ok, event_result} <-
             %{
               participant_id: participant.id,
               launched_event_id: launched_event.id,
               result_data: %QuizResult{participant_answers: participant_answers}
             }
             |> Utils.from_deep_struct()
             |> EventResults.create_event_result() do
        Helpers.subscription_publish(
          :event_result_submitted,
          Topics.session_presenter(launched_event.session.id, launched_event.session.user_id),
          event_result
        )

        {:ok, event_result}
      end
    end

    verify_launched_event(ctx, launched_event_id, on_verify)
  end
end
