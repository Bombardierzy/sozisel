defmodule SoziselWeb.Schema.Resolvers.SessionResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Model.{Sessions, Sessions.Session}

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

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
    fetch_resource!(ctx, Session)
    |> Sessions.end_session()
  end
end
