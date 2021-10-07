defmodule SoziselWeb.Schema.Resolvers.SessionResourceResolvers do
  use Sozisel.Model.Schema

  alias Sozisel.Repo
  # alias Sozisel.Model.SessionResources
  alias SoziselWeb.Context
  alias Sozisel.Model.{SessionResources, SessionResourceLinks, Sessions}
  alias SessionResources.SessionResource
  alias SessionResourceLinks.SessionResourceLink
  alias Sessions.Session

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  require Logger

  @media_storage_module Sozisel.MediaStorage.Disk

  def upload_resource(_parent, %{resource: %Plug.Upload{} = resource}, ctx) do
    user = Context.current_user!(ctx)
    extension = Path.extname(resource.filename)
    path = SessionResource.generate_filename(user.id, resource.filename)

    Ecto.Multi.new()
    |> Ecto.Multi.insert(
      :resource,
      SessionResource.changeset(%SessionResource{}, %{
        path: path,
        filename: resource.filename,
        user_id: user.id
      })
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
      {:ok, %{resource: _}} ->
        {:ok, "Session resource has been uploaded successfully"}

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

  def delete_resource(_parent, %{id: id}, _ctx) do
    with %SessionResource{} = resource <- Repo.get_by(SessionResource, id: id) do
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
        {:ok, %{resource: _}} ->
          {:ok, "Session resource has been deleted successfully"}

        {:error, operation, value, _others} ->
          Logger.error(
            "Failed to delete session resource: #{inspect(operation)}, #{inspect(value)}"
          )

          {:error, "failed to delete session resource"}
      end
    else
      nil ->
        {:error, "session resource does not exist"}
    end
  end

  def attach_resource_to_session(
        _parent,
        %{input: %{resource_id: resource_id, session_id: session_id, is_public: is_public}},
        _ctx
      ) do
    with %SessionResource{} = resource <- Repo.get_by(SessionResource, id: resource_id),
         %Session{} = session <- Repo.get_by(Session, id: session_id) do
      {:ok, %SessionResourceLink{} = session_resource_link} =
        SessionResourceLinks.create_session_resource_link(%{
          is_public: is_public,
          session_id: session.id,
          session_resource_id: resource.id
        })

      {:ok, %{id: session_resource_link.id, is_public: is_public}}
    else
      nil ->
        Logger.error("resource or session do not exist")
        {:error, nil}
    end
  end

  def change_access_resource(_parent, %{id: id}, _ctx) do
    with %SessionResourceLink{} = session_resource_link <-
           Repo.get_by(SessionResourceLink, id: id) do
      SessionResourceLinks.update_session_resource_link(session_resource_link, %{
        is_public: !session_resource_link.is_public
      })

      {:ok, "Access has been successfully changed"}
    else
      nil ->
        {:error, "session resource does not exist"}
    end
  end

  def detach_resource_from_session(
        _parent,
        %{id: id},
        _ctx
      ) do
    with %SessionResourceLink{} = session_resource_link <-
           Repo.get_by(SessionResourceLink, id: id) do
      {:ok, %SessionResourceLink{}} =
        SessionResourceLinks.delete_session_resource_link(session_resource_link)

      {:ok, "Session resource link has been saccessfully deleted from session"}
    else
      nil ->
        {:error, "session resource link does not exist"}
    end
  end

  def get_files(_parent, _, ctx) do
    user = Context.current_user!(ctx)

    session_resources =
      %{}
      |> Map.put(:user_id, user.id)
      |> SessionResources.list_session_resources()

    {:ok, session_resources}
  end

  def get_presenter_session_resources(_parent, %{id: id}, _ctx) do
    session_resource_links =
      %{}
      |> Map.put(:session_id, id)
      |> SessionResourceLinks.list_session_resource_links()
      |> Repo.preload(:session_resource)

    session_resources =
      Enum.map(session_resource_links, fn session_resource_link ->
        %{
          id: session_resource_link.session_resource.id,
          is_public: session_resource_link.is_public,
          filename: session_resource_link.session_resource.filename
        }
      end)

    {:ok, session_resources}
  end

  def get_participant_session_resources(_parent, %{id: id}, _ctx) do
    session_resource_links =
      %{}
      |> Map.put(:session_id, id)
      |> Map.put(:is_public, true)
      |> SessionResourceLinks.list_session_resource_links()
      |> Repo.preload(:session_resource)

    session_resources =
      Enum.map(session_resource_links, fn session_resource_link ->
        %{
          id: session_resource_link.id,
          filename: session_resource_link.session_resource.filename
        }
      end)

    {:ok, session_resources}
  end

  def download_session_resource_presenter(_parent, _, ctx) do
    session_resource = fetch_resource!(ctx, SessionResource)
    {:ok, %{id: session_resource.id, path: session_resource.path}}
  end

  def download_session_resource_participant(_parent, %{id: id}, _ctx) do
    with %SessionResourceLink{is_public: true} = session_resource_link <-
           Repo.get_by(SessionResourceLink, id: id),
         %SessionResource{} = session_resource <-
           Repo.get_by(SessionResource, id: session_resource_link.session_resource_id) do
      {:ok, %{id: session_resource.id, path: session_resource.path}}
    else
      _ ->
        {:error, nil}
    end
  end
end
