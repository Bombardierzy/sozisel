defmodule Sozisel.Model.SessionRecordings do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

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

  def change_session_recording(%SessionRecording{} = session_recording, attrs \\ %{}) do
    SessionRecording.changeset(session_recording, attrs)
  end
end
