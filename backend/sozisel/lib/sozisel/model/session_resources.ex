defmodule Sozisel.Model.SessionResources do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.SessionResources.SessionResource

  def list_session_resources do
    Repo.all(SessionResource)
  end

  def get_session_resource!(id), do: Repo.get!(SessionResource, id)

  def create_session_resource(attrs \\ %{}) do
    %SessionResource{}
    |> SessionResource.changeset(attrs)
    |> Repo.insert()
  end

  def delete_session_resource(%SessionResource{} = session_resource) do
    Repo.delete(session_resource)
  end

  def change_session_resource(%SessionResource{} = session_resource, attrs \\ %{}) do
    SessionResource.changeset(session_resource, attrs)
  end
end
