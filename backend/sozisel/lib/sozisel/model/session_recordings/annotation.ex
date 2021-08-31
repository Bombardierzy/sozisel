defmodule Sozisel.Model.SessionRecordings.Annotation do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          timestamp: non_neg_integer(),
          label: String.t()
        }

  @primary_key false
  embedded_schema do
    field :id, :binary_id
    field :timestamp, :integer
    field :label, :string
  end

  def changeset(annotation, attrs) do
    annotation
    |> cast(attrs, [:id, :timestamp, :label])
    |> validate_required([:id, :timestamp, :label])
    |> validate_number(:timestamp, greater_than_or_equal_to: 0)
    |> validate_length(:label, min: 1, max: 200)
  end
end
