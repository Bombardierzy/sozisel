defmodule SoziselWeb.Schema.Resolvers.SessionResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Repo
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias Sozisel.Model.Sessions
  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.SessionRecordings
  alias Sozisel.Model.SessionRecordings.SessionRecording
  alias Sozisel.Model.Polls.Poll

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  require Logger

  @media_storage_module Sozisel.MediaStorage.Disk

  def get_session(_parent, %{id: session_id}, ctx) do
    user_id = Context.current_user!(ctx).id

    with %Session{user_id: ^user_id} = session <- Repo.get(Session, session_id) do
      {:ok, session}
    else
      %Session{} -> {:error, :unauthorized}
      nil -> {:ok, nil}
    end
  end

  def get_session_thumbnail(_parent, %{id: session_id}, _ctx) do
    with %Session{} = session <- Repo.get(Session, session_id) do
      session =
        session
        |> Repo.preload(session_template: [:agenda_entries])

      thumbnail =
        session
        |> Map.put(:password_required, session.entry_password != nil)
        |> Map.put(:agenda_entries, session.session_template.agenda_entries)
        |> Map.put(
          :estimated_time,
          session.session_template.estimated_time
        )

      {:ok, thumbnail}
    else
      nil -> {:ok, nil}
    end
  end

  def create(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    input
    |> Map.put(:user_id, user.id)
    |> Sessions.create_session()
  end

  def update(_parent, %{input: input}, ctx) do
    fetch_resource!(ctx, Session)
    |> Sessions.update_session(input)
  end

  def delete(_parent, _args, ctx) do
    fetch_resource!(ctx, Session)
    |> Sessions.delete_session()
  end

  def start_session(_parent, _args, ctx) do
    fetch_resource!(ctx, Session)
    |> Sessions.start_session()
  end

  def end_session(_parent, _args, ctx) do
    {:ok, session} =
      fetch_resource!(ctx, Session)
      |> Sessions.end_session()

    Helpers.subscription_publish(
      :session_notifications,
      Topics.session_all_participants(session.id),
      %{info: :session_end}
    )

    {:ok, session}
  end

  def search(_parent, %{input: filters}, ctx) do
    user = Context.current_user!(ctx)

    sessions =
      filters
      |> Map.put(:user_id, user.id)
      |> Sessions.list_sessions()

    {:ok, sessions}
  end

  def session_summary(_parent, _args, ctx) do
    session = fetch_resource!(ctx, Session)

    {:ok, session |> Sessions.session_summary()}
  end

  def poll_summary(_parent, %{launched_event_id: launched_event_id}, _ctx) do
    {:ok, Poll.poll_summary(launched_event_id)}
  end

  def upload_recording(
        _parent,
        %{id: session_id, recording: %Plug.Upload{} = recording},
        _ctx
      ) do
    extension = Path.extname(recording.filename)
    filename = SessionRecording.generate_filename(session_id, extension)

    Ecto.Multi.new()
    # TODO: add metadata upload from file to a json map to keep it in postgres
    |> Ecto.Multi.insert(
      :recording,
      SessionRecording.changeset(%SessionRecording{}, %{
        path: filename,
        session_id: session_id,
        metadata: %{}
      })
    )
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

        # leave changeset as error for more readable error messages
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
end
