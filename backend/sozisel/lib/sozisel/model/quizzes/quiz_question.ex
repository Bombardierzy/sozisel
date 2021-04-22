defmodule Sozisel.Model.Quizzes.QuizQuestion do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          question: String.t(),
          answers: [String],
          correct_answers: [Integer]
        }

  @primary_key false

  embedded_schema do
    field :question, :string
    field :answers, {:array, :string}
    field :correct_answers, {:array, :integer}
  end

  def changeset(quiz_question, attrs) do
    quiz_question
    |> cast(attrs, [:question, :answers, :correct_answers])
    |> validate_required([:question, :answers, :correct_answers])
    |> validate_length(:answers, min: 2)
    |> validate_length(:correct_answers, min: 1)
  end
end
