defmodule Sozisel.Model.Sessions.Template do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Users.User
  alias Sozisel.Model.Sessions.{ AgendaEntry, Session }
  alias Sozisel.Model.Events.Event

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          estimated_time: Integer.t(),
          is_abstract: Boolean.t(),
          is_public: Boolean.t(),
          deleted_at: DateTime.t() | nil,
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  @doc """
  Templates schema consist of the following fields
  :name -> name of template
  :estimated_time -> estimated time of session in minutes
  :is_abstract -> if set to true template is abstract and can be used only
              to create other templates
  :is_public -> if set to true template is public and may be seen by any other user
  :deleted_at -> if not null owner deleted template and it won't be displayed,
              however it still has to remain in our database cause some past sessions may have refference to it
  :user -> creator and owner of session template
  :agenda_entries -> entries in session template agenda
  :sessions -> sessions created based on that template
  """
  schema "session_templates" do
    field :deleted_at, :utc_datetime_usec, default: nil
    field :estimated_time, :integer
    field :is_abstract, :boolean, default: false
    field :is_public, :boolean, default: false
    field :name, :string
    belongs_to :user, User
    has_many :agenda_entries, AgendaEntry, foreign_key: :session_template_id
    has_many :sessions, Session, foreign_key: :session_template_id
    has_many :events, Event, foreign_key: :session_template_id

    timestamps()
  end

  def create_changeset(template, attrs) do
    template
    |> cast(attrs, [:name, :estimated_time, :is_abstract, :is_public, :deleted_at, :user_id])
    |> validate_required([:name, :estimated_time, :user_id])
    |> foreign_key_constraint(:user_id)
  end

  # TODO
  # Remember to check if any session was created based on a template
  # if yes, template can't be edited
  # user can only copy, or delete it
  def update_changeset(template, attrs) do
    template
    |> cast(attrs, [:name, :estimated_time, :is_abstract, :is_public, :deleted_at])
    |> validate_required([:name, :estimated_time])
  end
end
