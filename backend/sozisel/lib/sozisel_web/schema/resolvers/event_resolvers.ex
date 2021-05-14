defmodule SoziselWeb.Schema.Resolvers.EventResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Repo
  alias Sozisel.Model.{Events, Sessions}
  alias Events.Event
  alias Sessions.Template

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  def get_event(_parent, %{id: event_id}, ctx) do
    user_id = Context.current_user!(ctx).id

    with %Event{} = event <- Repo.get(Event, event_id),
         %Template{} = template <- Repo.get(Template, event.session_template_id),
         true <- template.user_id == user_id do
      {:ok, event}
    else
      %Event{} -> {:error, :unauthorized}
      false -> {:error, :unauthorized}
      nil -> {:ok, nil}
    end
  end

  def create(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    with %Template{} = template <- Sessions.get_template(input.session_template_id),
         true <- template.user_id == user.id do
      Events.create_event(input)
    else
      nil -> {:error, "sessions template not found"}
      false -> {:error, "unauthorized"}
    end
  end

  def update(_parent, %{input: input}, ctx) do
    fetch_resource!(ctx, Event)
    |> Events.update_event(input)
  end

  def delete(_parent, _args, ctx) do
    fetch_resource!(ctx, Event)
    |> Events.delete_event()
  end
end
