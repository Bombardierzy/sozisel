defmodule Sozisel.Model.Quizzes.QuizResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.ParticipantAnswer

  @type t :: %__MODULE__{
          participant_answers: [ParticipantAnswer.t()],
          quiz_time: Float.t()
        }

  @primary_key false

  embedded_schema do
    embeds_many :participant_answers, ParticipantAnswer, on_replace: :delete
    field :quiz_time, :float
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [])
    |> cast_embed(:participant_answers, :quiz_time)
    |> validate_required([:participant_answers, :quiz_time])
  end
end
