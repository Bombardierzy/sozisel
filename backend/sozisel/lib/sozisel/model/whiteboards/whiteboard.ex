defmodule Sozisel.Model.Whiteboards.Whiteboard do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          task: String.t()
        }

  @primary_key false

  embedded_schema do
    field :task, :string
  end

  def changeset(whiteboard, attrs) do
    whiteboard
    |> cast(attrs, [:task])
    |> validate_required([:task])
  end
end
