defmodule Sozisel.Model.EventResults do
  import Ecto.Query, warn: false

  alias Sozisel.Repo

  alias Sozisel.Model.{EventResults, LaunchedEvents, Events}
  alias EventResults.EventResult
  alias LaunchedEvents.LaunchedEvent
  alias Events.Event

  require Logger

  def list_event_results do
    Repo.all(EventResult)
  end

  def get_event_result!(id), do: Repo.get!(EventResult, id)

  def create_event_result(%{launched_event_id: launched_event_id} = attrs) do
    with %LaunchedEvent{event_id: event_id} <- Repo.get(LaunchedEvent, launched_event_id),
         %Event{event_data: %event_data_module{} = event_data} <- Repo.get(Event, event_id),
         :ok <- event_data_module.validate_result(event_data, attrs) do
      %EventResult{}
      |> EventResult.create_changeset(attrs)
      |> Repo.insert()
    else
      {:error, :unmatched_event_result} = error ->
        error

      nil ->
        {:error, :launched_event_not_found}
    end
  end

  def create_event_result(_attrs) do
    raise RuntimeError, "invalid attributes, expected at least 'launched_event_id'"
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
    |> Repo.preload(:participant)
  end

  def quiz_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)

    total_points =
      quiz_results
      |> Enum.flat_map(& &1.result_data.participant_answers)
      |> Enum.map(& &1.points)
      |> Enum.sum()

    total_quiz_answer_time =
      quiz_results
      |> Enum.flat_map(& &1.result_data.participant_answers)
      |> Enum.map(& &1.answer_time)
      |> Enum.sum()

    participant_answers = Enum.flat_map(quiz_results, & &1.result_data.participant_answers)

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
      |> Enum.map(fn participant_results ->
        result_data = participant_results.result_data

        participant_answers = result_data.participant_answers

        number_of_points =
          participant_answers
          |> Enum.map(& &1.points)
          |> Enum.sum()

        quiz_answer_time =
          participant_answers
          |> Enum.map(& &1.answer_time)
          |> Enum.sum()

        participant = participant_results.participant

        %{
          full_name: participant.full_name,
          email: participant.email,
          number_of_points: number_of_points,
          quiz_answer_time: quiz_answer_time,
          participant_answers: participant_answers
        }
      end)

    quiz_participant_summary
  end

  def quiz_questions_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)

    event =
      event_launched
      |> Ecto.assoc(:event)
      |> Repo.one()

    quiz_questions = event.event_data.quiz_questions

    quiz_questions_summary =
      quiz_questions
      |> Enum.map(fn question ->
        participants_answers = get_participants_answer_for_qestion(quiz_results, question)

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

  defp get_participants_answer_for_qestion(quiz_results, question) do
    quiz_results
    |> Enum.map(fn participant_results ->
      participant = participant_results.participant

      participant_result =
        participant_results.result_data.participant_answers
        |> Enum.find(&(&1.question_id == question.id))

      %{
        full_name: participant.full_name,
        email: participant.email,
        points: participant_result.points,
        answer_time: participant_result.answer_time,
        final_answer_ids: participant_result.final_answer_ids,
        track_nodes: participant_result.track_nodes
      }
    end)
  end
end
