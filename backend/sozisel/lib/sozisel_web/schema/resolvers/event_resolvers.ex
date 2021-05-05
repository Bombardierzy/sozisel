defmodule SoziselWeb.Schema.Resolvers.EventResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Model.{Events, Sessions}
  alias Events.Event
  alias Sessions.Template

  def create(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    with %Template{} = template <- Sessions.get_template(input.session_template_id),
         true <- template.user_id == user.id do
      Events.create_event(input)
    else
      other -> handle_other(other)
    end
  end

  def update(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    with %Event{} = event <- Events.get_event(input.id),
         %Template{} = template <- Sessions.get_template(event.session_template_id),
         true <- template.user_id == user.id do
      input.id
      |> Events.get_event()
      |> Events.update_event(input)
    else
      other -> handle_other(other)
    end
  end

  def delete(_parent, %{id: id}, ctx) do
    user = Context.current_user!(ctx)

    with %Event{} = event <- Events.get_event(id),
         %Template{} = template <- Sessions.get_template(event.session_template_id),
         true <- template.user_id == user.id do
      Events.delete_event(event)
    else
      nil ->
        {:error, "event not found"}

      false ->
        {:error, "unauthorized"}
    end
  end

  defp handle_other(value) do
    case value do
      nil -> {:error, "sessions template not found"}
      false -> {:error, "unauthorized"}
    end
  end
end
