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

  def submit_quiz_results(
        _parent,
        %{
          input: %{
            launched_event_id: launched_event_id,
            participant_answers: participant_answers
          },
          token: participant_token
        },
        _ctx
      ) do
    with %LaunchedEvent{} = launched_event <-
           LaunchedEvents.get_launched_event(launched_event_id),
         %Event{} = event <- Repo.preload(launched_event, :event).event,
         %Session{} = session <- Repo.preload(launched_event, :session).session,
         %Participant{} = participant <- Participants.find_by_token(participant_token) do
      event_questions = Map.get(event.event_data, :quiz_questions)

      participant_answers =
        Enum.map(event_questions, fn event_question ->
          answer_on_question =
            Enum.find(participant_answers, fn map -> map.question_id == event_question.id end)

          correct_answers_ids = event_question.correct_answers |> Enum.map(& &1.id)

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

      {:ok, event_result} =
        %{}
        |> Map.put(:participant_id, participant.id)
        |> Map.put(:launched_event_id, launched_event.id)
        |> Map.put(:result_data, %QuizResult{participant_answers: participant_answers})
        |> Utils.from_deep_struct()
        |> EventResults.create_event_result()

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
