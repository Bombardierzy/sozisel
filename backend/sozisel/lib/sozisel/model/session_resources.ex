defmodule Sozisel.Model.SessionResources do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.SessionResources.SessionResource

  def list_session_resources do
    Repo.all(SessionResource)
  end

  @doc """
  Returns list of session_resources that match given filters.

  Available filters:
  * `user_id` - owner of the session
  """
  def list_session_resources(filters) do
    filters
    |> Enum.reduce(SessionResource, fn
      {:user_id, user_id}, session_resource ->
        from sr in session_resource, where: sr.user_id == ^user_id
    end)
    |> Repo.all()
  end

  def get_session_resource!(id), do: Repo.get!(SessionResource, id)

  def create_session_resource(attrs \\ %{}) do
    %SessionResource{}
    |> SessionResource.changeset(attrs)
    |> Repo.insert()
  end

  def update_session_resource(%SessionResource{} = session_resource, attrs) do
    session_resource
    |> SessionResource.changeset(attrs)
    |> Repo.update()
  end

  def delete_session_resource(%SessionResource{} = session_resource) do
    Repo.delete(session_resource)
  end

  def change_session_resource(%SessionResource{} = session_resource, attrs \\ %{}) do
    SessionResource.changeset(session_resource, attrs)
  end
end
