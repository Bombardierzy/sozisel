defmodule Sozisel.Model.Sessions do
  @moduledoc """
  The Sessions context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.Sessions.Template

  @doc """
  Returns the list of session_templates.
  TODO add preload
  """
  def list_session_templates do
    Repo.all(Template)
  end

  @doc """
  Returns the list of session_templates that belongs to user
  TODO add preload
  """
  def list_user_templates(user_id) do
    from(t in Template, where: t.user_id == ^user_id)
    |> Repo.all()
  end

  @doc """
  Returns the list of public session_templates
  TODO add preload
  """
  def list_public_templates do
    from(t in Template, where: t.is_public == true)
    |> Repo.all()
  end

  @doc """
  Gets a single template.

  Raises `Ecto.NoResultsError` if the Template does not exist.
  TODO add preload
  """
  def get_template!(id), do: Repo.get!(Template, id)

  @doc """
  Creates a template.
  """
  def create_template(attrs \\ %{}) do
    %Template{}
    |> Template.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a template.
  """
  def update_template(%Template{} = template, attrs) do
    template
    |> Template.update_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Performs soft delete
  """
  def delete_template(%Template{} = template) do
    template
    |> Template.update_changeset(%{deleted_at: DateTime.utc_now()})
    |> Repo.update()
  end

  alias Sozisel.Model.Sessions.AgendaEntry

  @doc """
  Returns the list of agenda_entries.
  """
  def list_agenda_entries do
    Repo.all(AgendaEntry)
  end

  @doc """
  Returns the list of agenda_entries for session_template
  """
  def list_agenda_entries(session_template_id) do
    from(a in AgendaEntry, where: a.session_template_id == ^session_template_id)
    |> Repo.all()
  end

  @doc """
  Gets a single agenda_entry.

  Raises `Ecto.NoResultsError` if the Agenda entry does not exist.
  """
  def get_agenda_entry!(id), do: Repo.get!(AgendaEntry, id)

  @doc """
  Creates a agenda_entry.
  """
  def create_agenda_entry(attrs \\ %{}) do
    %AgendaEntry{}
    |> AgendaEntry.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a agenda_entry.
  """
  def update_agenda_entry(%AgendaEntry{} = agenda_entry, attrs) do
    agenda_entry
    |> AgendaEntry.update_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a agenda_entry.
  """
  def delete_agenda_entry(%AgendaEntry{} = agenda_entry) do
    Repo.delete(agenda_entry)
  end

  alias Sozisel.Model.Sessions.Session

  @doc """
  Returns the list of sessions.
  TODO add preload
  """
  def list_sessions do
    Repo.all(Session)
  end

  @doc """
  Returns the list of sessions that belongs to user
  TODO add preload
  """
  def list_user_sessions(user_id) do
    from(s in Session, where: s.user_id == ^user_id)
    |> Repo.all()
  end

  @doc """
  Gets a single session.

  Raises `Ecto.NoResultsError` if the Session does not exist.
  TODO add preload
  """
  def get_session!(id), do: Repo.get!(Session, id)

  @doc """
  Creates a session.
  """
  def create_session(attrs \\ %{}) do
    %Session{}
    |> Session.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a session.
  """
  def update_session(%Session{} = session, attrs) do
    session
    |> Session.update_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a session.
  """
  def delete_session(%Session{} = session) do
    Repo.delete(session)
  end
end
