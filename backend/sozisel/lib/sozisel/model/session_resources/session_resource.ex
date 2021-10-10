defmodule Sozisel.Model.SessionResources.SessionResource do
  use Sozisel.Model.Schema

  alias Sozisel.Model.Users.User
  alias Sozisel.Model.SessionResourceLinks.SessionResourceLink

  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          path: String.t(),
          filename: String.t(),
          user_id: Ecto.UUID.t(),
          user: User.t() | Ecto.Association.NotLoaded.t(),
          session_resource_links: [SessionResourceLink.t()] | Ecto.Association.NotLoaded.t()
        }

  schema "session_resources" do
    field :path, :string
    field :filename, :string

    belongs_to :user, User

    has_many :session_resource_links, SessionResourceLink

    timestamps()
  end

  @doc false
  def changeset(session_resource, attrs) do
    session_resource
    |> cast(attrs, [:path, :filename, :user_id])
    |> validate_required([:path, :filename, :user_id])
    |> unique_constraint(:path, message: "resource with given path already exists")
    |> foreign_key_constraint(:user_id)
  end

  @spec generate_filename(user_id :: Ecto.UUID.t(), filename :: String.t()) :: String.t()
  def generate_filename(user_id, filename) do
    "resource_#{user_id}_#{filename}" |> String.replace(" ", "_")
  end
end
