defmodule Sozisel.Model.LaunchedEvents.LaunchedEvent do
  use Sozisel.Model.Schema

  alias Sozisel.Model.{Events.Event, Sessions.Session}
  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          session_id: Ecto.UUID.t(),
          session: Session.t() | Ecto.Association.NotLoaded.t(),
          event_id: Ecto.UUID.t(),
          event: Event.t() | Ecto.Association.NotLoaded.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "launched_events" do
    belongs_to :session, Session
    belongs_to :event, Event

    timestamps()
  end

  @doc false
  def changeset(launched_event, attrs) do
    launched_event
    |> cast(attrs, [:session_id, :event_id])
    |> validate_required([:session_id, :event_id])
    |> foreign_key_constraint(:session_id)
    |> foreign_key_constraint(:event_id)
  end
end
