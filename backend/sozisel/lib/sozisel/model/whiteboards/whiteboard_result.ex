defmodule Sozisel.Model.Whiteboards.WhiteboardResult do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  @type t :: %__MODULE__{
          path: String.t(),
          text: String.t(),
          used_time: Float.t()
        }

  @primary_key false

  embedded_schema do
    field :path, :string
    field :text, :string
    field :used_time, :float
  end

  @spec changeset(t(), map) :: Ecto.Changeset.t()
  def changeset(whiteboard_result, attrs) do
    whiteboard_result
    |> cast(attrs, [:path, :used_time, :text])
    |> validate_required([:path, :used_time])
  end

  @spec generate_filename(Ecto.UUID.t(), Ecto.UUID.t(), String.t()) :: String.t()
  def generate_filename(launched_event_id, participant_id, extension) do
    "whiteboard_#{launched_event_id}_#{participant_id}#{extension}" |> String.replace(" ", "_")
  end
end
