defmodule Sozisel.Model.Quizzes.ParticipantAnswer do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.TrackNode

  @type t :: %__MODULE__{
          final_answer: String.t(),
          is_correct: Boolean.t(),
          track_nodes: [TrackNode.t()]
        }

  @primary_key false

  embedded_schema do
    field :final_answer, :string
    field :is_correct, :boolean
    embeds_many :track_nodes, TrackNode, on_replace: :delete
  end

  def changeset(participant_answer, attrs) do
    participant_answer
    |> cast(attrs, [:is_correct])
    |> cast_embed(:track_nodes)
    |> validate_required([:is_correct])
  end
end
