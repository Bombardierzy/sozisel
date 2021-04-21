defmodule Sozisel.Model.Quizzes.Quiz do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.Quiz_question

  @type t :: %__MODULE__{
          duration_time: Integer.t(),
          number_of_targets: Integer.t(),
          tracking_mode: Boolean.t(),
          quiz_questions: [Quiz_question]
        }

  @primary_key false

  embedded_schema do
    field :duration_time, :integer
    field :number_of_targets, :integer
    field :tracking_mode, :boolean, default: false
    embeds_many :quiz_questions, Quiz_question
  end

  def create_changeset(quiz, attrs) do
    quiz
    |> cast(attrs, [:duration_time, :number_of_targets, :quiz_questions])
    |> validate_required([:duration_time, :number_of_targets])
  end
end
