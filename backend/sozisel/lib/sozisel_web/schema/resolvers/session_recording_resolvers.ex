defmodule SoziselWeb.Schema.Resolvers.SessionRecordingResolvers do
  alias Sozisel.Repo
  alias Sozisel.Model.SessionRecordings
  alias Sozisel.Model.SessionRecordings.SessionRecording

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  require Logger

  @media_storage_module Sozisel.MediaStorage.Disk

  def get_session_recording(_parent, %{id: id}, _ctx) do
    {:ok, SessionRecordings.get_session_recording!(id)}
  end

  def upload_recording(
        _parent,
        %{id: session_id, recording: %Plug.Upload{} = recording},
        _ctx
      ) do
    extension = Path.extname(recording.filename)
    filename = SessionRecording.generate_filename(session_id, extension)

    Ecto.Multi.new()
    |> Ecto.Multi.insert(
      :recording,
      SessionRecording.changeset(%SessionRecording{}, %{
        path: filename,
        session_id: session_id
      })
    )
    |> Ecto.Multi.update(:default_annotations, fn %{recording: recording} ->
      annotations = SessionRecordings.default_recording_annotations(recording)

      Ecto.Changeset.change(recording, annotations: annotations)
    end)
    |> Ecto.Multi.run(:file_rename, fn _repo, %{recording: _} ->
      processed_video_path = Path.rootname(recording.path) <> "_processed" <> extension

      with :ok <-
             Sozisel.VideoProcessor.make_video_streamable(recording.path, processed_video_path),
           :ok <- @media_storage_module.store_file(filename, processed_video_path) do
        {:ok, %{}}
      end
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{recording: _}} ->
        {:ok, "recording has been uploaded"}

      {:error, operation, value, _others} ->
        Logger.error("Failed to upload recording: #{inspect(operation)}, #{inspect(value)}")

        # leave changeset as an error so that error's middleware properly format the error itself
        if match?(%Ecto.Changeset{}, value) do
          {:error, value}
        else
          {:error, "failed to upload recording"}
        end
    end
  end

  def delete_recording(_parent, %{id: session_id}, _ctx) do
    with %SessionRecording{} = recording <- Repo.get_by(SessionRecording, session_id: session_id) do
      Ecto.Multi.new()
      |> Ecto.Multi.delete(:recording, recording)
      |> Ecto.Multi.run(:file_storage, fn _repo, %{recording: recording} ->
        with :ok <- @media_storage_module.remove_file(recording.path) do
          {:ok, %{}}
        else
          # file does not exist, just delete the database entry
          {:error, :enoent} ->
            {:ok, %{}}

          error ->
            error
        end
      end)
      |> Repo.transaction()
      |> case do
        {:ok, %{recording: _}} ->
          {:ok, "recording has been deleted"}

        {:error, operation, value, _others} ->
          Logger.error("Failed to delete recording: #{inspect(operation)}, #{inspect(value)}")
          {:error, "failed to delete recording"}
      end
    else
      nil ->
        {:error, "recording does not exist"}
    end
  end

  def update_recording_annotations(_parent, %{annotations: annotations}, ctx) do
    session_recording = fetch_resource!(ctx, SessionRecording)

    SessionRecordings.update_session_recording(session_recording, %{annotations: annotations})
  end

  def reset_recording_annotations(_parent, _args, ctx) do
    session_recording = fetch_resource!(ctx, SessionRecording)

    default_annotations = SessionRecordings.default_recording_annotations(session_recording)

    SessionRecordings.update_session_recording(session_recording, %{
      annotations: default_annotations
    })
  end
end
