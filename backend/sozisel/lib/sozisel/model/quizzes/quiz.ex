defmodule Sozisel.Model.Quizzes.Quiz do
  use Ecto.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.Quiz_question

  embedded_schema do
    field :duration_time, :integer
    field :number_of_targets, :integer
    field :tracking_mode, :boolean, default: false
    # has_many :quiz_questions, Quiz_question, foreign_key: :quiz_id
    embeds_many :quiz_questions, Quiz_question
  end

  @doc false
  def changeset(quiz, attrs) do
    quiz
    # |> cast(attrs, [:duration_time, :number_of_targets, :tracking_mode])
    # |> validate_required([:duration_time, :tracking_mode, :number_of_targets])
  end
end
