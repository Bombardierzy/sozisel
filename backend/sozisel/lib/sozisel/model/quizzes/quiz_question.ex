defmodule Sozisel.Model.Quizzes.Quiz_question do
  use Ecto.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.Quiz

  embedded_schema do
    field :answers, {:array, :string}
    field :correct_answers, {:array, :integer}
    field :question, :string
    # belongs_to :quiz, Quiz

  end

  @doc false
  def changeset(quiz_question, attrs) do
    quiz_question
    # |> cast(attrs, [:question, :answers, :correct_answers])
    # |> validate_required([:question, :answers, :correct_answers])
  end
end
