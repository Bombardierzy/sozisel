defmodule Sozisel.Model.Quizzes.QuizQuestion do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.Answer

  @type t :: %__MODULE__{
          question: String.t(),
          answers: [String.t()],
          correct_answers: [String.t()]
        }

  @primary_key false

  embedded_schema do
    field :question, :string
    embeds_many :answers, Answer, on_replace: :delete
    embeds_many :correct_answers, Answer, on_replace: :delete
  end

  def changeset(quiz_question, attrs) do
    quiz_question
    |> cast(attrs, [:question])
    |> cast_embed(:answers)
    |> cast_embed(:correct_answers)
    |> validate_required([:question, :answers, :correct_answers])
    |> validate_answer_inclusion()
    |> validate_length(:answers, min: 2)
    |> validate_length(:correct_answers, min: 1)
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
end
