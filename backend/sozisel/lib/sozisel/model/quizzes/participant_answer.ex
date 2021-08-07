defmodule Sozisel.Model.Quizzes.ParticipantAnswer do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.TrackNode

  @type t :: %__MODULE__{
          question_id: String.t(),
          final_answer_ids: [String.t()],
          answer_time: Float.t(),
          points: Flaot.t(),
          track_nodes: [TrackNode.t()]
        }

  @primary_key false

  embedded_schema do
    field :question_id, :string
    field :final_answer_ids, {:array, :string}
    field :answer_time, :float
    field :points, :float
    embeds_many :track_nodes, TrackNode, on_replace: :delete
  end

  def changeset(participant_answer, attrs) do
    participant_answer
    |> cast(attrs, [:question_id, :points, :final_answer_ids, :answer_time])
    |> cast_embed(:track_nodes)
    |> validate_required([:question_id, :points, :final_answer_ids, :answer_time])
  end
end
