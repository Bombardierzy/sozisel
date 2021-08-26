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
    time_to_annotations =
      from(sr in SessionRecording,
        join: s in Session,
        on: sr.session_id == s.id,
        join: le in LaunchedEvent,
        on: le.session_id == s.id,
        join: e in Event,
        on: e.id == le.event_id,
        where: sr.id == ^session_recording.id,
        order_by: le.inserted_at,
        select: [le.inserted_at, e]
      )
      |> Repo.all()
      |> Enum.map(fn [time, event] ->
        {DateTime.to_unix(time), %{id: Ecto.UUID.generate(), label: event.name}} |> IO.inspect()
      end)

    case time_to_annotations do
      [] ->
        []

      [{lowest_time, _annotation} | _rest] ->
        {annotations, _time} =
          time_to_annotations
          |> Enum.map_reduce(lowest_time, fn {time, annotation}, lower_time ->
            {Map.put(annotation, :timestamp, time - lower_time), time}
          end)

        annotations
    end
  end

  def change_session_recording(%SessionRecording{} = session_recording, attrs \\ %{}) do
    SessionRecording.changeset(session_recording, attrs)
  end
end
