defmodule Sozisel.Model.EventResults do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.{EventResults, LaunchedEvents.LaunchedEvent, Utils, Participants, Events}
  alias Participants.Participant
  alias EventResults.EventResult

  def list_event_results do
    Repo.all(EventResult)
  end

  def get_event_result!(id), do: Repo.get!(EventResult, id)

  def create_event_result(attrs \\ %{}) do
    %EventResult{}
    |> EventResult.create_changeset(attrs)
    |> Repo.insert()
  end

  def update_event_result(%EventResult{} = event_result, attrs) do
    event_result
    |> EventResult.update_changeset(attrs)
    |> Repo.update()
  end

  def delete_event_result(%EventResult{} = event_result) do
    Repo.delete(event_result)
  end

  def change_event_result(%EventResult{} = event_result, attrs \\ %{}) do
    EventResult.create_changeset(event_result, attrs)
  end

  def get_all_event_results(%LaunchedEvent{} = launched_event) do
    launched_event
    |> Repo.preload(:event_results)
    |> then(& &1.event_results)
  end

  def quiz_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)

    total_points =
      quiz_results
      |> Enum.flat_map(& &1.result_data.participant_answers)
      |> Enum.map(& &1.points)
      |> Enum.sum()

    total_quiz_answer_time =
      quiz_results |> Enum.map(& &1.result_data.quiz_answer_time) |> Enum.sum()

    participant_answers =
      quiz_results
      |> Enum.flat_map(& &1.result_data.participant_answers)

    %{
      number_of_participants: length(quiz_results),
      average_points: total_points / length(participant_answers),
      average_quiz_answer_time: total_quiz_answer_time / length(quiz_results)
    }
  end

  def quiz_participants_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)

    quiz_participant_summary =
      quiz_results
      |> Enum.map(fn participant_result ->
        result_data =
          participant_result
          |> Utils.from_deep_struct()
          |> Map.get(:result_data)

        participant_answers =
          result_data
          |> Map.get(:participant_answers)

        number_of_points =
          participant_answers
          |> Enum.map(& &1.points)
          |> Enum.sum()

        %Participant{email: email, full_name: full_name} =
          Participants.get_participant!(Map.get(participant_result, :participant_id))

        %{
          full_name: full_name,
          email: email,
          number_of_points: number_of_points,
          quiz_answer_time: result_data |> Map.get(:quiz_answer_time),
          participant_answers: participant_answers
        }
      end)

    quiz_participant_summary
  end

  def quiz_questions_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)

    event = Events.get_event(event_launched.event_id)
    quiz_questions = event.event_data.quiz_questions

    quiz_questions_summary =
      quiz_questions
      |> Enum.map(fn question ->
        participants_answers =
          quiz_results
          |> Enum.map(fn participant_results ->
            %Participant{email: email, full_name: full_name} =
              Participants.get_participant!(participant_results.participant_id)

            participant_result =
              participant_results.result_data.participant_answers
              |> Enum.find(&(&1.question_id == question.id))

            %{
              full_name: full_name,
              email: email,
              points: participant_result.points,
              answer_time: participant_result.answer_time,
              final_answer_ids: participant_result.final_answer_ids,
              track_nodes: participant_result.track_nodes
            }
          end)

        total_question_answer_time =
          participants_answers |> Enum.map(& &1.answer_time) |> Enum.sum()

        total_question_points = participants_answers |> Enum.map(& &1.points) |> Enum.sum()

        %{
          question: question.question,
          question_id: question.id,
          answers: question.answers,
          correct_answers: question.correct_answers,
          average_point: total_question_points / length(participants_answers),
          average_answer_time: total_question_answer_time / length(participants_answers),
          participants_answers: participants_answers
        }
      end)

    quiz_questions_summary
  end
end
