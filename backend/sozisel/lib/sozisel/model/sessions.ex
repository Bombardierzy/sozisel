defmodule Sozisel.Model.Sessions do
  @moduledoc """
  The Sessions context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo
  alias Sozisel.Model.{Utils, Events}

  alias Sozisel.Model.Sessions.{AgendaEntry, Template}
  alias Sozisel.Model.Users.User

  @doc """
  Returns the list of session_templates.
  """
  def list_session_templates do
    Repo.all(Template)
  end

  @doc """
  Returns list of session_template that matches given filters.
  Example filters: [user_id: "id", is_public: true, name: "Sozisel"]
  """
  def list_session_templates(filters) do
    filters
    |> Enum.reduce(Template, fn
      {:user_id, user_id}, template ->
        from t in template, where: t.user_id == ^user_id

      {:is_public, true}, template ->
        from t in template, where: t.is_public == true

      {:name, name}, template ->
        from t in template, where: ilike(t.name, ^"%#{Utils.escape_wildcards(name)}%")
    end)
    |> Repo.all()
  end

  @doc """
  Gets a single template.

  Raises `Ecto.NoResultsError` if the Template does not exist.
  """
  def get_template!(id) do
    Repo.get!(Template, id)
  end

  def get_template(id) do
    Repo.get(Template, id)
  end

  @doc """
  Creates a template.
  """
  def create_template(attrs \\ %{}) do
    %Template{}
    |> Template.create_changeset(attrs)
    |> Repo.insert()
  end

  def create_template_with_agenda(attrs \\ %{}) do
    agenda_entries = attrs[:agenda_entries] || []

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:template, Template.create_changeset(%Template{}, attrs))
    |> add_template_agenda_entries(agenda_entries)
    |> Repo.transaction()
    |> case do
      {:ok, %{template: template}} ->
        {:ok, template}

      {:error, _name, value, _changes_so_far} ->
        {:error, value}
    end
  end

  def update_template_with_agenda(template, attrs) do
    delete_entries? = Map.has_key?(attrs, :agenda_entries)

    Ecto.Multi.new()
    |> Ecto.Multi.update(:template, Template.update_changeset(template, attrs))
    |> delete_agenda_entries(template, delete_entries?)
    |> add_template_agenda_entries(attrs[:agenda_entries])
    |> Repo.transaction()
    |> case do
      {:ok, %{template: template}} ->
        {:ok, template}

      {:error, _name, value, _changes_so_far} ->
        {:error, value}
    end
  end

  defp delete_agenda_entries(multi, template, delete?) do
    if delete? do
      multi |> Ecto.Multi.delete_all(:deleted_entries, Ecto.assoc(template, :agenda_entries))
    else
      multi
    end
  end

  defp add_template_agenda_entries(multi, nil) do
    multi
  end

  defp add_template_agenda_entries(multi, agenda_entries) do
    agenda_entries
    |> Enum.reduce({0, multi}, fn entry, {idx, multi} ->
      multi =
        multi
        |> Ecto.Multi.insert(idx, fn %{template: template} ->
          %AgendaEntry{}
          |> AgendaEntry.create_changeset(Map.put(entry, :session_template_id, template.id))
        end)

      {idx + 1, multi}
    end)
    |> elem(1)
  end

  @doc """
  Updates a template.
  """
  def update_template(%Template{} = template, attrs) do
    template
    |> Template.update_changeset(attrs)
    |> Repo.update()
  end

  def clone_template(%Template{} = template, %User{} = user) do
    agenda_entries =
      Repo.preload(template, :agenda_entries).agenda_entries
      |> Enum.map(&Map.from_struct/1)

    copy_template =
      template
      |> Map.from_struct()
      |> Map.merge(%{id: nil, user_id: user.id, agenda_entries: agenda_entries})

    new_template = create_template_with_agenda(copy_template)
    Enum.each(Events.list_template_events(template.id), fn event -> event |> Map.from_struct() |> Map.merge(%{id: new_template.id}) |> Events.create_event() end)
    new_template
  end

  @doc """
  Performs soft delete
  """
  def delete_template(%Template{} = template) do
    template
    |> Template.update_changeset(%{deleted_at: DateTime.utc_now()})
    |> Repo.update()
  end

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
  """
  def list_sessions do
    Repo.all(Session)
  end

  @doc """
  Returns the list of sessions that belongs to user
  """
  def list_user_sessions(user_id) do
    from(s in Session, where: s.user_id == ^user_id)
    |> Repo.all()
  end

  @doc """
  Gets a single session.

  Raises `Ecto.NoResultsError` if the Session does not exist.
  """
  def get_session!(id) do
    Repo.get!(Session, id)
  end

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
