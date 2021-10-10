defmodule SoziselWeb.Schema.Resolvers.SessionResourceResolvers do
  use Sozisel.Model.Schema

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  alias Sozisel.Repo
  alias SoziselWeb.Context
  alias Sozisel.Model.{SessionResources, SessionResourceLinks, Sessions}
  alias SessionResources.SessionResource
  alias SessionResourceLinks.SessionResourceLink
  alias Sessions.Session

  require Logger

  @media_storage_module Sozisel.MediaStorage.Disk

  def upload_resource(_parent, %{resource: %Plug.Upload{} = resource}, ctx) do
    user = Context.current_user!(ctx)
    extension = Path.extname(resource.filename)
    path = SessionResource.generate_filename(user.id, resource.filename)

    session_resource_changeset =
      SessionResource.changeset(%SessionResource{}, %{
        path: path,
        filename: resource.filename,
        user_id: user.id
      })

    Ecto.Multi.new()
    |> Ecto.Multi.insert(
      :resource,
      session_resource_changeset
    )
    |> Ecto.Multi.run(:file_rename, fn _repo, %{resource: session_resource} ->
      processed_resource_path = Path.rootname(session_resource.path) <> "_processed" <> extension

      with :ok <- File.touch(processed_resource_path),
           :ok <- File.rename(resource.path, processed_resource_path),
           :ok <- @media_storage_module.store_file(path, processed_resource_path) do
        {:ok, %{}}
      end
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{resource: session_resource}} ->
        {:ok, session_resource}

      {:error, operation, value, _others} ->
        Logger.error(
          "Failed to upload session resource: #{inspect(operation)}, #{inspect(value)}"
        )

        # leave changeset as an error so that error's middleware properly format the error itself
        if match?(%Ecto.Changeset{}, value) do
          {:error, value}
        else
          {:error, "failed to upload session resource"}
        end
    end
  end

  def delete_resource(_parent, _args, ctx) do
    resource = fetch_resource!(ctx, SessionResource)

    Ecto.Multi.new()
    |> Ecto.Multi.delete(:resource, resource)
    |> Ecto.Multi.run(:file_storage, fn _repo, %{resource: resource} ->
      with :ok <- @media_storage_module.remove_file(resource.path) do
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
      {:ok, %{resource: session_resource}} ->
        {:ok, session_resource}

      {:error, operation, value, _others} ->
        Logger.error(
          "Failed to delete session resource: #{inspect(operation)}, #{inspect(value)}"
        )

        {:error, "failed to delete session resource"}
    end
  end

  def attach_resource_to_session(
        _parent,
        %{input: %{resource_id: resource_id, session_id: session_id, is_public: is_public}},
        _ctx
      ) do
    with %SessionResource{} = resource <- Repo.get(SessionResource, resource_id),
         %Session{} = session <- Repo.get(Session, session_id) do
      SessionResourceLinks.create_session_resource_link(%{
        is_public: is_public,
        session_id: session.id,
        session_resource_id: resource.id
      })
    else
      nil ->
        Logger.error("resource or session do not exist")
        {:error, nil}
    end
  end

  def detach_resource_session_link(_parent, _args, ctx) do
    resource = fetch_resource!(ctx, SessionResourceLink)

    SessionResourceLinks.delete_session_resource_link(resource)
  end

  def change_access_resource(_parent, %{is_public: is_public}, ctx) do
    resource = fetch_resource!(ctx, SessionResourceLink)

    SessionResourceLinks.update_session_resource_link(resource, %{
      is_public: is_public
    })
  end

  def get_presenter_session_resources(_parent, %{id: id}, _ctx) do
    session_resource_links = SessionResourceLinks.list_session_resource_links(%{session_id: id})

    {:ok, session_resource_links}
  end

  def get_participant_session_resources(_parent, %{id: id}, _ctx) do
    session_resource_links =
      SessionResourceLinks.list_session_resource_links(%{session_id: id, is_public: true})

    {:ok, session_resource_links}
  end
end
