defmodule Sozisel.Model.SessionRecordings.SessionRecording do
  use Sozisel.Model.Schema

  alias Sozisel.Model.Sessions.Session

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          metadata: map(),
          path: String.t(),
          session_id: Ecto.UUID.t(),
          session: Session.t() | Ecto.Association.NotLoaded.t()
        }

  schema "session_recordings" do
    # TODO: leave it for now, may be useful
    field :metadata, :map
    field :path, :string

    belongs_to :session, Session

    timestamps()
  end

  @doc false
  def changeset(session_recording, attrs) do
    session_recording
    |> cast(attrs, [:path, :metadata, :session_id])
    |> validate_required([:path, :metadata, :session_id])
    |> foreign_key_constraint(:session_id)
  end
end
