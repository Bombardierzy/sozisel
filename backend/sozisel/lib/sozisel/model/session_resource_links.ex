defmodule Sozisel.Model.SessionResourceLinks do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.SessionResourceLinks.SessionResourceLink

  def list_session_resource_links do
    Repo.all(SessionResourceLink)
  end

  @doc """
  Returns list of session_resource_links that match given filters.

  Available filters:
  * `session_id` - resources from a specific session
  * `is_public` - the file is available only to the presenter or to everyone
  """
  def list_session_resource_links(filters) do
    filters
    |> Enum.reduce(SessionResourceLink, fn
      {:session_id, session_id}, session_resource_link ->
        from srl in session_resource_link, where: srl.session_id == ^session_id

      {:is_public, is_public}, session_resource_link ->
        from srl in session_resource_link, where: srl.is_public == ^is_public
    end)
    |> Repo.all()
  end

  def get_session_resource_link!(id), do: Repo.get!(SessionResourceLink, id)

  def create_session_resource_link(attrs \\ %{}) do
    %SessionResourceLink{}
    |> SessionResourceLink.changeset(attrs)
    |> Repo.insert()
  end

  def update_session_resource_link(%SessionResourceLink{} = session_resource_link, attrs) do
    session_resource_link
    |> SessionResourceLink.changeset(attrs)
    |> Repo.update()
  end

  def delete_session_resource_link(%SessionResourceLink{} = session_resource_link) do
    Repo.delete(session_resource_link)
  end

  def change_session_resource_link(%SessionResourceLink{} = session_resource_link, attrs \\ %{}) do
    SessionResourceLink.changeset(session_resource_link, attrs)
  end
end
