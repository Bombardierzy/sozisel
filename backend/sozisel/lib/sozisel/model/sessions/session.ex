defmodule Sozisel.Model.Sessions.Session do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.Users.User

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          entry_password: String.t() | nil,
          start_time: Integer.t(),
          use_jitsi: Boolean.t(),
          user_id: Ecto.UUID.t(),
          user: User.t() | Ecto.Association.NotLoaded.t(),
          session_template_id: Ecto.UUID.t(),
          session_template: Template.t() | Ecto.Association.NotLoaded.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "sessions" do
    field :entry_password, :string, default: nil
    field :name, :string
    field :start_time, :utc_datetime_usec
    field :use_jitsi, :boolean, default: false
    belongs_to :session_template, Template
    belongs_to :user, User

    timestamps()
  end

  def create_changeset(session, attrs) do
    session
    |> cast(attrs, [
      :name,
      :start_time,
      :entry_password,
      :use_jitsi,
      :user_id,
      :session_template_id
    ])
    |> validate_required([:name, :start_time, :session_template_id, :user_id])
    |> foreign_key_constraint(:session_template_id)
    |> foreign_key_constraint(:user_id)
  end

  def update_changeset(session, attrs) do
    session
    |> cast(attrs, [:name, :start_time, :entry_password, :use_jitsi])
    |> validate_required([:name, :start_time, :use_jitsi])
  end
end
