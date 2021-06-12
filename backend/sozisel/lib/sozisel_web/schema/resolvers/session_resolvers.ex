defmodule SoziselWeb.Schema.Resolvers.SessionResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Repo
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias Sozisel.Model.{Sessions, Sessions.Session, SessionRecordings.SessionRecording}

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  require Logger

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
      thumbnail =
        session
        |> Map.put(:password_required, session.entry_password != nil)

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

  def upload_recording(
        _parent,
        %{id: session_id, recording: %Plug.Upload{} = recording},
        _ctx
      ) do
    upload_path =
      Path.join([
        Application.fetch_env!(:sozisel, SoziselWeb.Recordings) |> Keyword.fetch!(:upload_path),
        "#{session_id}_#{recording.filename}"
      ])

    Ecto.Multi.new()
    # TODO: add metadata upload from file to a json map to keep it in postgres
    |> Ecto.Multi.insert(
      :recording,
      SessionRecording.changeset(%SessionRecording{}, %{
        path: upload_path,
        session_id: session_id,
        metadata: %{}
      })
    )
    |> Ecto.Multi.run(:file_rename, fn _repo, %{recording: session_recording} ->
      with :ok <- File.touch(session_recording.path),
           :ok <- File.rename(recording.path, session_recording.path) do
        {:ok, %{}}
      else
        error -> error
      end
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{recording: _}} ->
        {:ok, "recording has been uploaded"}

      {:error, operation, value, _others} ->
        Logger.error("Failed to upload recording: #{inspect(operation)}, #{inspect(value)}")
        {:error, "failed to upload recording"}
    end
  end
end
