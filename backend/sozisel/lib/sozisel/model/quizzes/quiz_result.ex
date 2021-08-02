defmodule Sozisel.Model.Quizzes.QuizResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.ParticipantAnswer

  @type t :: %__MODULE__{
          participant_answers: [ParticipantAnswer.t()],
          quiz_answer_time: Float.t()
        }

  @primary_key false

  embedded_schema do
    embeds_many :participant_answers, ParticipantAnswer, on_replace: :delete
    field :quiz_answer_time, :float
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [:quiz_answer_time])
    |> cast_embed(:participant_answers, required: true)
    |> validate_required([:participant_answers, :quiz_answer_time])
  end
end
