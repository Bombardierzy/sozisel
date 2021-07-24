defmodule Sozisel.Model.Quizzes.Quiz do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.QuizQuestion

  @type t :: %__MODULE__{
          duration_time_sec: Integer.t(),
          target_percentage_of_participants: Integer.t(),
          quiz_questions: [QuizQuestion.t()]
        }

  @primary_key false

  ### As we resign from tracking_mode property all quizzes are tracked by default
  embedded_schema do
    field :duration_time_sec, :integer
    field :target_percentage_of_participants, :integer
    embeds_many :quiz_questions, QuizQuestion, on_replace: :delete
  end

  def changeset(quiz, attrs) do
    quiz
    |> cast(attrs, [:duration_time_sec, :target_percentage_of_participants])
    |> cast_embed(:quiz_questions)
    |> validate_required([:duration_time_sec, :target_percentage_of_participants])
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
end
