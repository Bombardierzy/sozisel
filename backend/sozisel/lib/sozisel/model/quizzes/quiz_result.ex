defmodule Sozisel.Model.Quizzes.QuizResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.{ParticipantAnswer, QuizQuestion}

  @type t :: %__MODULE__{
          participant_answers: [ParticipantAnswer.t()]
        }

  @primary_key false

  embedded_schema do
    embeds_many :participant_answers, QuizQuestion, on_replace: :delete
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [:participant_answers])
    |> validate_required([:participant_answers])
  end
end
