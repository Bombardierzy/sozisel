defmodule Sozisel.Model.LaunchedEvents do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.{Sessions.Session, Events.Event, LaunchedEvents.LaunchedEvent}

  def get_launched_event!(id), do: Repo.get!(LaunchedEvent, id)

  def get_launched_event(id), do: Repo.get(LaunchedEvent, id)

  def create_launched_event(attrs \\ %{}) do
    %LaunchedEvent{}
    |> LaunchedEvent.changeset(attrs)
    |> Repo.insert()
  end

  def create_launched_event(%Session{} = session, %Event{} = event) do
    %LaunchedEvent{}
    |> LaunchedEvent.changeset(%{session_id: session.id, event_id: event.id})
    |> Repo.insert()
  end

  def change_launched_event(%LaunchedEvent{} = launched_event, attrs \\ %{}) do
    LaunchedEvent.changeset(launched_event, attrs)
  end
end
