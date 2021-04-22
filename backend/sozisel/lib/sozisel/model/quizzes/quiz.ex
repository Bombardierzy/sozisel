defmodule Sozisel.Model.Quizzes.Quiz do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.QuizQuestion

  @type t :: %__MODULE__{
          duration_time_sec: Integer.t(),
          target_percentage_of_students: Integer.t(),
          tracking_mode: Boolean.t(),
          quiz_questions: [QuizQuestion.t()]
        }

  @primary_key false

  embedded_schema do
    field :duration_time_sec, :integer
    field :target_percentage_of_students, :integer
    field :tracking_mode, :boolean, default: false
    embeds_many :quiz_questions, QuizQuestion, on_replace: :delete
  end

  def changeset(quiz, attrs) do
    quiz
    |> cast(attrs, [:duration_time_sec, :target_percentage_of_students])
    |> cast_embed(:quiz_questions)
    |> validate_required([:duration_time_sec, :target_percentage_of_students])
    |> validate_inclusion(:target_percentage_of_students, 1..100)
  end
end
