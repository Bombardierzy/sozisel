defmodule Sozisel.Model.Quizzes.Quiz do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.QuizQuestion

  @type t :: %__MODULE__{
          duration_time_sec: Integer.t(),
          target_percentage_of_participants: Integer.t(),
          tracking_mode: Boolean.t(),
          quiz_questions: [QuizQuestion.t()]
        }

  @primary_key false

  embedded_schema do
    field :duration_time_sec, :integer
    field :target_percentage_of_participants, :integer
    field :tracking_mode, :boolean
    embeds_many :quiz_questions, QuizQuestion, on_replace: :delete
  end

  def changeset(quiz, attrs) do
    quiz
    |> cast(attrs, [:duration_time_sec, :target_percentage_of_participants, :tracking_mode])
    |> cast_embed(:quiz_questions)
    |> validate_required([:duration_time_sec, :target_percentage_of_participants, :tracking_mode])
    |> validate_quiz_question_length()
    |> validate_inclusion(:target_percentage_of_participants, 1..100)
  end

  def validate_quiz_question_length(changeset) do
    quiz_questions = get_field(changeset, :quiz_questions)

    if length(quiz_questions) >= 1 do
      changeset
    else
      add_error(changeset, :quiz_questions, "Quiz_questions must contain at least 1 element")
    end
  end
end
