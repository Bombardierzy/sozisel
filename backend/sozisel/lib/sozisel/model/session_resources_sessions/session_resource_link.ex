defmodule Sozisel.Model.SessionResourceLinks.SessionResourceLink do
  use Sozisel.Model.Schema

  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.SessionResources.SessionResource

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          session_resource_id: Ecto.UUID.t(),
          session_resource: SessionResource.t() | Ecto.Association.NotLoaded.t(),
          session_id: Ecto.UUID.t(),
          session: Session.t() | Ecto.Association.NotLoaded.t(),
          is_public: Boolean.t()
        }

  schema "session_resource_links" do
    field :is_public, :boolean, default: false

    belongs_to :session, Session
    belongs_to :session_resource, SessionResource

    timestamps()
  end

  @doc false
  def changeset(session_resources_session, attrs) do
    session_resources_session
    |> cast(attrs, [:session_resource_id, :session_id, :is_public])
    |> validate_required([:session_resource_id, :session_id])
    |> foreign_key_constraint(:session_resource_id)
    |> foreign_key_constraint(:session_id)
  end
end
