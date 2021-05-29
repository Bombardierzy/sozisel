defmodule Sozisel.Model.Quizzes.QuizResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.ParticipantAnswer

  @type t :: %__MODULE__{
          participant_answers: [ParticipantAnswer.t()]
        }

  @primary_key false

  embedded_schema do
    embeds_many :participant_answers, ParticipantAnswer, on_replace: :delete
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [])
    |> cast_embed(:participant_answers)
    |> validate_required([:participant_answers])
  end
end
