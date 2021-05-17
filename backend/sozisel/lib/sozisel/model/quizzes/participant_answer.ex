defmodule Sozisel.Model.Quizzes.ParticipantAnswer do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Quizzes.TrackNode

  @type t :: %__MODULE__{
          question: String.t(),
          all_answers: [String.t()],
          final_answers: [String.t()],
          is_correct: Boolean.t(),
          track_nodes: [TrackNode.t()]
        }

  @primary_key false

  embedded_schema do
    field :question, :string
    field :all_answers, {:array, :string}
    field :final_answers, {:array, :string}
    field :is_correct, :boolean
    embeds_many :track_nodes, TrackNode, on_replace: :delete
  end

  def changeset(participant_answer, attrs) do
    participant_answer
    |> cast(attrs, [:question, :all_answers, :is_correct])
    |> cast_embed(:track_nodes)
    |> validate_required([:question, :all_answers, :is_correct])
  end
end
