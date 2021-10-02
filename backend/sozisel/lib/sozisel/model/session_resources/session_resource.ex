defmodule Sozisel.Model.SessionResources.SessionResource do
  use Sozisel.Model.Schema

  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.Users.User

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          path: String.t(),
          is_public: Boolean.t(),

          user_id: Ecto.UUID.t(),
          user: User.t() | Ecto.Association.NotLoaded.t(),

          sessions: [Session.t()] | Ecto.Association.NotLoaded.t(),
        }

  schema "session_resources" do
    field :path, :string
    field :is_public, :boolean, default: false
    
    belongs_to :user, User

    # has_many :sessions, Session
    many_to_many :sessions, Session, join_through: "session_resources_sessios"

    timestamps()
  end

  @doc false
  def changeset(session_resource, attrs) do
    session_resource
    |> cast(attrs, [:path, :user_id])
    |> validate_required([:path, :user_id])
    |> foreign_key_constraint(:user_id)
  end

  @spec generate_filename(session_id :: Ecto.UUID.t(), extension :: String.t()) :: String.t()
  def generate_filename(session_id, extension) do
    "session_#{session_id}#{extension}" |> String.replace(" ", "_")
  end
end
