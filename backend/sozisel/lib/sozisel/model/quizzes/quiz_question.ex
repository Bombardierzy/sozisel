defmodule Sozisel.Model.Quizzes.QuizQuestion do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.Answer

  @type t :: %__MODULE__{
          question: String.t(),
          id: String.t(),
          answers: [Answer.t()],
          correct_answers: [Answer.t()]
        }

  @primary_key false

  embedded_schema do
    field :question, :string
    field :id, :string
    embeds_many :answers, Answer, on_replace: :delete
    embeds_many :correct_answers, Answer, on_replace: :delete
  end

  def changeset(quiz_question, attrs) do
    quiz_question
    |> cast(attrs, [:question, :id])
    |> cast_embed(:answers, required: true)
    |> cast_embed(:correct_answers, required: true)
    |> validate_required([:question, :answers, :correct_answers])
    |> validate_answers_length()
    |> validate_correct_answers_length()
    |> validate_answer_inclusion()
  end

  def validate_answer_inclusion(changeset) do
    answers = get_change(changeset, :answers) || get_field(changeset, :answers)

    correct_answers =
      get_change(changeset, :correct_answers) || get_field(changeset, :correct_answers)

    if Enum.all?(correct_answers, &Enum.member?(answers, &1)) do
      changeset
    else
      add_error(changeset, :correct_answers, "Correct answers must be included in answers")
    end
  end

  def validate_answers_length(changeset) do
    answers = get_change(changeset, :answers) || get_field(changeset, :answers)

    if length(answers) >= 2 do
      changeset
    else
      add_error(changeset, :answers, "Answers must contain at least 2 elements")
    end
  end

  def validate_correct_answers_length(changeset) do
    correct_answers =
      get_change(changeset, :correct_answers) || get_field(changeset, :correct_answers)

    if length(correct_answers) >= 1 do
      changeset
    else
      add_error(changeset, :correct_answers, "Correct answers must contain at least 1 element")
    end
  end
end
