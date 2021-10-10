defmodule Sozisel.Model.Users.User do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Users.Security
  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.SessionResources.SessionResource

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          first_name: String.t(),
          last_name: String.t(),
          password_hash: String.t(),
          password: String.t() | nil,
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "users" do
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :password_hash, :string

    field :password, :string, virtual: true

    has_many :session_templates, Template
    has_many :session_resources, SessionResource

    timestamps()
  end

  def create_changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :first_name, :last_name, :password])
    |> validate_required([:email, :first_name, :last_name, :password])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
    |> Security.hash_password()
  end

  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :first_name, :last_name, :password])
    |> validate_required([:email, :first_name, :last_name])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
    |> Security.hash_password()
  end
end
