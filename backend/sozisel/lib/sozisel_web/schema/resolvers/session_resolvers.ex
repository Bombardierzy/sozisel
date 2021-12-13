defmodule SoziselWeb.Schema.Resolvers.SessionResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Repo
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias Sozisel.Model.Sessions
  alias Sozisel.Model.Sessions.Session

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
      session =
        session
        |> Repo.preload(session_template: [:agenda_entries])

      thumbnail =
        session
        |> Map.put(:session_ended, session.end_time != nil)
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
end
