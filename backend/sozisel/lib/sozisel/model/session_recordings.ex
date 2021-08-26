defmodule Sozisel.Model.SessionRecordings do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  alias Sozisel.Model.SessionRecordings.SessionRecording

  def list_session_recordings do
    Repo.all(SessionRecording)
  end

  def get_session_recording!(id), do: Repo.get!(SessionRecording, id)

  def create_session_recording(attrs \\ %{}) do
    %SessionRecording{}
    |> SessionRecording.changeset(attrs)
    |> Repo.insert()
  end

  def update_session_recording(%SessionRecording{} = session_recording, attrs) do
    session_recording
    |> SessionRecording.changeset(attrs)
    |> Repo.update()
  end

  def delete_session_recording(%SessionRecording{} = session_recording) do
    Repo.delete(session_recording)
  end

  def default_recording_annotations(%SessionRecording{} = session_recording) do
    from(sr in SessionRecording,
      join: s in Session,
      on: sr.session_id == s.id,
      join: le in LaunchedEvent,
      on: le.session_id == s.id,
      join: e in Event,
      on: e.id == le.event_id,
      where: sr.id == ^session_recording.id,
      order_by: le.inserted_at,
      select: [s.inserted_at, le.inserted_at, e]
    )
    |> Repo.all()
    |> Enum.map(fn [session_time, time, event] ->
      timestamp = DateTime.to_unix(time) - DateTime.to_unix(session_time)

      %{id: Ecto.UUID.generate(), timestamp: timestamp, label: event.name}
    end)
  end

  def change_session_recording(%SessionRecording{} = session_recording, attrs \\ %{}) do
    SessionRecording.changeset(session_recording, attrs)
  end
end
