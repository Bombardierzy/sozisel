defmodule Sozisel.Model.Quizzes.Quiz do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.QuizQuestion

  @type t :: %__MODULE__{
          target_percentage_of_participants: Integer.t(),
          quiz_questions: [QuizQuestion.t()]
        }

  @primary_key false

  embedded_schema do
    field :target_percentage_of_participants, :integer
    embeds_many :quiz_questions, QuizQuestion, on_replace: :delete
  end

  def changeset(quiz, attrs) do
    quiz
    |> cast(attrs, [:target_percentage_of_participants])
    |> cast_embed(:quiz_questions)
    |> validate_required([:target_percentage_of_participants])
    |> validate_quiz_questions_length()
    |> validate_inclusion(:target_percentage_of_participants, 1..100)
  end

  def validate_quiz_questions_length(changeset) do
    quiz_questions = get_field(changeset, :quiz_questions)

    if length(quiz_questions) >= 1 do
      changeset
    else
      add_error(changeset, :quiz_questions, "Quiz_questions must contain at least 1 element")
    end
  end

  @doc """
  Checks if all participant answers are present and selected answer ids are present in the quiz questions.
  """
  @spec validate_result(t(), map()) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{quiz_questions: quiz_questions}, %{
        result_data: %{participant_answers: participant_answers}
      }) do
    # group questions to %{question_id => question} structure for easier lookup
    quiz_questions =
      quiz_questions
      |> Enum.map(&{&1.id, &1})
      |> Enum.into(%{})

    # for each answer check if it has related question and all final_answer_ids
    # are included in that question
    participant_answers
    |> Enum.all?(fn %{question_id: question_id, final_answer_ids: final_answer_ids} ->
      Map.has_key?(quiz_questions, question_id) and
        MapSet.difference(
          MapSet.new(final_answer_ids),
          MapSet.new(quiz_questions[question_id].answers, & &1.id)
        )
        |> MapSet.size() == 0
    end)
    |> case do
      true -> :ok
      false -> {:error, :unmatched_event_result}
    end
  end

  def validate_result(_quiz, _quiz_result) do
    {:error, :unmatched_event_result}
  end
end
