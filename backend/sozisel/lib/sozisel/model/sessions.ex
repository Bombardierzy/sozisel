defmodule Sozisel.Model.Sessions do
  @moduledoc """
  The Sessions context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.{
    EventResults.EventResult,
    Participants.Participant,
    LaunchedEvents.LaunchedEvent,
    Sessions.Session,
    Users.User,
    Utils,
    Events
  }

  alias Events.Event
  alias Sozisel.Model.Sessions.{AgendaEntry, Session, Template}

  @doc """
  Checks if user is an owner of given template
  """
  def is_template_owner(session_template_id, user_id) do
    from(
      t in Template,
      where: t.id == ^session_template_id and t.user_id == ^user_id
    )
    |> Repo.exists?()
  end

  @doc """
  Checks if user is an owner of given session
  """
  def is_session_owner(session_id, user_id) do
    from(
      s in Session,
      where: s.id == ^session_id and s.user_id == ^user_id
    )
    |> Repo.exists?()
  end

  @doc """
  Returns the list of session_templates.
  """
  def list_session_templates do
    Repo.all(Template)
  end

  @doc """
  Returns list of session_template that match given filters.

  Available filters:
  * `user_id` - owner of given templates
  * `is_public` - a boolean whether templates should be public or not
  * `name` - phrase to match templates' names on
  * `deleted` - a boolean whether to include soft deleted templates
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

      {:deleted, false}, template ->
        from t in template, where: is_nil(t.deleted_at)
    end)
    |> Repo.all()
  end

  @doc """
  Returns list of sessions that match given filters.

  Available filters:
  * `user_id` - owner of the session
  * `template_id` - id of the session's template
  * `status` - either :scheduled | :running | :ended | :any
  * `name` - phrase to match session's name on
  * `date_from` - date from which scheduled_start_time should start
  * `date_to` - date up to which scheduled_start_time should end
  """
  def list_sessions(filters) do
    filters
    |> Enum.reduce(Session, fn
      {:user_id, user_id}, session ->
        from s in session, where: s.user_id == ^user_id

      {:template_id, template_id}, session ->
        from s in session, where: s.session_template_id == ^template_id

      {:name, name}, session ->
        from s in session, where: ilike(s.name, ^"%#{Utils.escape_wildcards(name)}%")

      {:status, :scheduled}, session ->
        from s in session, where: is_nil(s.start_time)

      {:status, :in_progress}, session ->
        from s in session, where: not is_nil(s.start_time) and is_nil(s.end_time)

      {:status, :ended}, session ->
        from s in session, where: not is_nil(s.end_time)

      {:status, :any}, session ->
        session

      {:date_from, date_from}, session ->
        from s in session, where: s.scheduled_start_time >= ^date_from

      {:date_to, date_to}, session ->
        from s in session, where: s.scheduled_start_time <= ^date_to
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

  def start_session(%Session{} = session) do
    session |> update_session(%{start_time: DateTime.utc_now()})
  end

  def end_session(%Session{} = session) do
    session |> update_session(%{end_time: DateTime.utc_now()})
  end

  def create_template_with_agenda_and_events(attrs \\ %{}) do
    agenda_entries = attrs[:agenda_entries] || []
    events = attrs[:events] || []

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:template, Template.create_changeset(%Template{}, attrs))
    |> add_template_agenda_entries(agenda_entries)
    |> add_template_events(events, length(agenda_entries))
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

  def participant_can_join_session(%Session{} = session) do
    case session.start_time do
      nil ->
        {:error, "session has not been started"}

      _ ->
        case session.end_time do
          nil -> {:ok}
          _ -> {:error, "session has been ended"}
        end
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

  defp add_template_events(multi, [], _) do
    multi
  end

  defp add_template_events(multi, events, index) do
    events
    |> Enum.reduce({index, multi}, fn event, {idx, multi} ->
      event = Utils.from_deep_struct(event)

      multi =
        multi
        |> Ecto.Multi.insert(idx, fn %{template: template} ->
          %Event{}
          |> Event.create_changeset(Map.put(event, :session_template_id, template.id))
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

    events =
      template.id
      |> Events.list_template_events()

    copy_template =
      template
      |> Map.from_struct()
      |> Map.merge(%{id: nil, user_id: user.id, agenda_entries: agenda_entries, events: events})

    create_template_with_agenda_and_events(copy_template)
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
  Returns a sessions summary. Please go see `:session_summary` graphql type for more details.
  """
  def session_summary(%Session{id: session_id, start_time: start_time, end_time: end_time}) do
    participations =
      """
      select le.id, le.event_id, e.name, le.inserted_at, e.event_data->>'__type__', count(er.id) from sessions s
      join launched_events le on le.session_id = s.id
      join events e on e.id = le.event_id
      left join event_results er on er.launched_event_id = le.id
      where s.id = '#{session_id}'
      group by le.id, le.event_id, e.name, le.inserted_at, e.event_data
      order by le.inserted_at;
      """
      |> Repo.query()
      |> case do
        {:ok, %Postgrex.Result{rows: rows}} ->
          rows
          |> Enum.map(fn [launched_event_id, event_id, name, inserted_at, event_type, count] ->
            {:ok, event_id} = Ecto.UUID.load(event_id)
            {:ok, launched_event_id} = Ecto.UUID.load(launched_event_id)
            {:ok, inserted_date_time} = DateTime.from_naive(inserted_at, "Etc/UTC")

            %{
              launched_event_id: launched_event_id,
              event_id: event_id,
              event_name: name,
              start_minute: DateTime.diff(inserted_date_time, start_time) |> div(60),
              event_type: String.to_existing_atom(event_type),
              submissions: count
            }
          end)

        error ->
          error
      end

    %{
      # get minutes instead of seconds
      duration_time: DateTime.diff(end_time, start_time) |> div(60),
      event_participations: participations,
      total_participants:
        Repo.aggregate(from(p in Participant, where: p.session_id == ^session_id), :count),
      total_submissions:
        Repo.aggregate(
          from(er in EventResult,
            join: le in LaunchedEvent,
            on: le.id == er.launched_event_id,
            join: e in Event,
            on: e.id == le.event_id,
            where: le.session_id == ^session_id
          ),
          :count
        )
    }
  end

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

  def get_session(id) do
    Repo.get(Session, id)
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
