defmodule Sozisel.Model.Quizzes.TrackNode do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          reaction_time: Float.t(),
          answer_id: String.t(),
          selected: Boolean.t()
        }

  @primary_key false

  embedded_schema do
    field :reaction_time, :float
    field :answer_id, :string
    field :selected, :boolean
  end

  def changeset(track_node, attrs) do
    track_node
    |> cast(attrs, [:reaction_time, :answer_id, :selected])
    |> validate_required([:reaction_time, :answer_id, :selected])
  end
end
