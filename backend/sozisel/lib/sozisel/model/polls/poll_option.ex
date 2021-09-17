defmodule Sozisel.Model.Polls.PollOption do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: String.t(),
          text: String.t()
        }

  @primary_key false
  embedded_schema do
    field :id, :string
    field :text, :string
  end

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:id, :text])
    |> validate_required([:id, :text])
  end
end
