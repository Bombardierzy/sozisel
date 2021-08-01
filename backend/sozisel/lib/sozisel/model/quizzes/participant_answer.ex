defmodule Sozisel.Model.Quizzes.ParticipantAnswer do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.TrackNode

  @type t :: %__MODULE__{
          question_id: String.t(),
          final_answer_ids: [String.t()],
          is_correct: Boolean.t(),
          track_nodes: [TrackNode.t()]
        }

  @primary_key false

  embedded_schema do
    field :question_id, :string
    field :final_answer_ids, {:array, :string}
    field :is_correct, :boolean
    embeds_many :track_nodes, TrackNode, on_replace: :delete
  end

  def changeset(participant_answer, attrs) do
    participant_answer
    |> cast(attrs, [:question_id, :is_correct, :final_answer_ids])
    |> cast_embed(:track_nodes, required: true)
    |> validate_required([:question_id, :is_correct, :final_answer_ids])
  end
end
