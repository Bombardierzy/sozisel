defmodule Sozisel.Model.Quizzes.TrackNode do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          fractional_second: Float.t(),
          answer: String.t()
        }

  @primary_key false

  embedded_schema do
    field :fractional_second, :float
    field :answer, :string
  end

  def changeset(track_node, attrs) do
    track_node
    |> cast(attrs, [:fractional_second, :answer])
    |> validate_required([:fractional_second, :answer])
  end
end
