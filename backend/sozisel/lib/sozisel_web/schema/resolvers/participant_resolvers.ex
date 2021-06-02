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
    EventResults.EventResult
  }

  alias Events.Event
  alias LaunchedEvents.LaunchedEvent
  alias Sessions.Session
  alias Participants.Participant
  alias Quizzes.{QuizResult, ParticipantAnswer, TrackNode}

  require Logger

  # password is optional so we can't always pattern match on all arguments
  def create(
        _parent,
        %{input: %{email: email, full_name: full_name, session_id: session_id} = input},
        _ctx
      ) do
    entry_password = Map.get(input, :entry_password)

    with %Session{entry_password: ^entry_password} <- Repo.get_by(Session, id: session_id),
         {:ok, %Participant{} = participant} <-
           Participants.create_participant(%{
             session_id: session_id,
             email: email,
             full_name: full_name
           }) do
      {:ok, %{token: participant.token}}
    else
      {:error, reason} ->
        Logger.error("Failed to create a participant with reason: #{inspect(reason)}")

        {:error, "failed to create a participant"}

      _ ->
        {:error, "unauthorized"}
    end
  end

  def check_quiz(
        _parent,
        %{
          input: %{
            participant_token: participant_token,
            launched_event_id: launched_event_id,
            participant_answers: participant_answers
          }
        },
        _ctx
      ) do
    with %LaunchedEvent{} = launched_event <-
           LaunchedEvents.get_launched_event(launched_event_id),
         %Event{} = event <- Events.get_event(launched_event.event_id),
         %Session{} = session <- Sessions.get_session(launched_event.session_id),
         %Participant{} = participant <- Participants.find_by_token(participant_token) do
      event_questions = Map.get(event.event_data, :quiz_questions)

      participant_answers =
        for event_question <- event_questions do
          answer_on_question =
            Enum.find(participant_answers, fn map -> map.question_id == event_question.id end)

          correct_answers_ids =
            Enum.map(event_question.correct_answers, fn event_question -> event_question.id end)

          track_nodes =
            for track_node <- answer_on_question.track_nodes do
              %TrackNode{
                answer_id: track_node.answer_id,
                reaction_time: track_node.reaction_time,
                selected: track_node.selected
              }
            end

          %ParticipantAnswer{
            question_id: event_question.id,
            final_answer_ids: answer_on_question.final_answer_ids,
            is_correct:
              Enum.sort(answer_on_question.final_answer_ids) == Enum.sort(correct_answers_ids),
            track_nodes: track_nodes
          }
        end

      event_result =
        %EventResult{
          participant_id: participant.id,
          launched_event_id: launched_event.id,
          result_data: %QuizResult{
            participant_answers: participant_answers
          }
        }
        |> Repo.insert()
        |> elem(1)

      Helpers.subscription_publish(
        :event_result_submitted,
        Topics.session_presenter(session.id, session.user_id),
        event_result
      )

      {:ok, event_result}
    else
      _ -> {:error, "unauthorized"}
    end
  end
end
