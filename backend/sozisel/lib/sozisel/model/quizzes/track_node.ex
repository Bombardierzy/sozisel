defmodule Sozisel.Model.Quizzes.TrackNode do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          reaction_time: Float.t(),
          answer: String.t()
        }

  @primary_key false

  embedded_schema do
    field :reaction_time, :float
    field :answer, :string
    field :selected, :boolean
  end

  def changeset(track_node, attrs) do
    track_node
    |> cast(attrs, [:reaction_time, :answer, :selected])
    |> validate_required([:reaction_time, :answer, :selected])
  end
end
