defmodule Sozisel.Model.Sessions.Session do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.Users.User
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias Sozisel.Model.SessionRecordings.SessionRecording
  alias Sozisel.Model.SessionResourceLinks.SessionResourceLink

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          entry_password: String.t() | nil,
          scheduled_start_time: DateTime.t(),
          start_time: DateTime.t() | nil,
          end_time: DateTime.t() | nil,
          use_jitsi: Boolean.t(),
          user_id: Ecto.UUID.t(),
          user: User.t() | Ecto.Association.NotLoaded.t(),
          session_resource_links: [SessionResourceLink.t()] | Ecto.Association.NotLoaded.t(),
          session_template_id: Ecto.UUID.t(),
          session_template: Template.t() | Ecto.Association.NotLoaded.t(),
          summary_note: String.t() | nil,
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "sessions" do
    field :entry_password, :string, default: nil
    field :name, :string
    field :scheduled_start_time, :utc_datetime_usec
    field :start_time, :utc_datetime_usec
    field :end_time, :utc_datetime_usec
    field :use_jitsi, :boolean, default: false
    field :summary_note, :string, default: nil

    belongs_to :session_template, Template
    belongs_to :user, User

    has_many :launched_events, LaunchedEvent
    has_one :session_recording, SessionRecording
    has_many :session_resource_links, SessionResourceLink

    timestamps()
  end

  def create_changeset(session, attrs) do
    session
    |> cast(attrs, [
      :name,
      :entry_password,
      :use_jitsi,
      :user_id,
      :scheduled_start_time,
      :start_time,
      :end_time,
      :session_template_id,
      :summary_note
    ])
    |> validate_required([:name, :scheduled_start_time, :session_template_id, :user_id])
    |> foreign_key_constraint(:session_template_id)
    |> foreign_key_constraint(:user_id)
    |> validate_start_and_end_times()
  end

  def update_changeset(session, attrs) do
    session
    |> cast(attrs, [
      :name,
      :scheduled_start_time,
      :start_time,
      :end_time,
      :entry_password,
      :use_jitsi,
      :summary_note
    ])
    |> validate_required([:name, :scheduled_start_time, :use_jitsi])
    |> validate_start_and_end_times()
  end

  defp validate_start_and_end_times(%Ecto.Changeset{valid?: false} = changeset), do: changeset

  defp validate_start_and_end_times(changeset) do
    start_time = get_change(changeset, :start_time) || get_field(changeset, :start_time)
    end_time = get_change(changeset, :end_time) || get_field(changeset, :end_time)

    cond do
      is_nil(start_time) and is_nil(end_time) ->
        changeset

      not is_nil(start_time) and is_nil(end_time) ->
        changeset

      is_nil(start_time) and not is_nil(end_time) ->
        add_error(changeset, :end_time, "start_time must be set before setting end_time")

      DateTime.compare(start_time, end_time) != :lt ->
        add_error(changeset, :end_time, "end_time must be set after start_time")

      true ->
        changeset
    end
  end
end
