defmodule Sozisel.Model.Quizzes.QuizResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.ParticipantAnswer

  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias Sozisel.Model.EventResults
  alias Sozisel.Repo

  @type t :: %__MODULE__{
          participant_answers: [ParticipantAnswer.t()]
        }

  @primary_key false

  embedded_schema do
    embeds_many :participant_answers, ParticipantAnswer, on_replace: :delete
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [])
    |> cast_embed(:participant_answers, required: true)
    |> validate_required([:participant_answers])
  end

  def quiz_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = EventResults.get_all_event_results(event_launched)

    event =
      event_launched
      |> Ecto.assoc(:event)
      |> Repo.one()

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

    number_of_all_questions = length(event.event_data.quiz_questions) * length(quiz_results)

    %{
      number_of_participants: length(quiz_results),
      average_points: (total_points / max(length(quiz_results), 1)) |> Float.round(2),
      average_quiz_answer_time:
        (total_quiz_answer_time / max(length(quiz_results), 1)) |> Float.round(2)
    }
  end

  def quiz_participants_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = EventResults.get_all_event_results(event_launched)

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
          number_of_points: (number_of_points * 1.0) |> Float.round(2),
          quiz_answer_time: (quiz_answer_time * 1.0) |> Float.round(2),
          participant_answers: participant_answers
        }
      end)

    quiz_participant_summary
  end

  def quiz_questions_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = EventResults.get_all_event_results(event_launched)

    event =
      event_launched
      |> Ecto.assoc(:event)
      |> Repo.one()

    quiz_questions = event.event_data.quiz_questions

    quiz_questions_summary =
      quiz_questions
      |> Enum.map(fn question ->
        participants_answers = get_participants_answer_for_question(quiz_results, question)

        total_question_answer_time =
          participants_answers |> Enum.map(& &1.answer_time) |> Enum.sum()

        total_question_points = participants_answers |> Enum.map(& &1.points) |> Enum.sum()

        %{
          question: question.question,
          question_id: question.id,
          answers: question.answers,
          correct_answers: question.correct_answers,
          average_point:
            (total_question_points / max(1, length(participants_answers))) |> Float.round(2),
          average_answer_time:
            (total_question_answer_time / max(1, length(participants_answers))) |> Float.round(2),
          participants_answers: participants_answers
        }
      end)

    quiz_questions_summary
  end

  defp get_participants_answer_for_question(quiz_results, question) do
    quiz_results
    |> Enum.map(fn participant_results ->
      participant = participant_results.participant

      participant_result =
        participant_results.result_data.participant_answers
        |> Enum.find(&(&1.question_id == question.id)) ||
          %{
            points: 0.0,
            answer_time: 0.0,
            final_answer_ids: [],
            track_nodes: []
          }

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
