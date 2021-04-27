defmodule SoziselWeb.Schema.Resolvers.EventResolvers do
  alias Sozisel.Model.{Events, Events.Event}

  def create(_parent, %{input: input}, _ctx) do
    Events.create_event(input)
  end

  def update(_parent, %{input: input}, _ctx) do
    with %Event{} = event <- Events.get_event(input.id) do
      Events.update_event(event, input)
    else
      nil ->
        {:error, "event not found"}
    end
  end

  def delete(_parent, %{id: id}, _ctx) do
    with %Event{} = event <- Events.get_event(id) do
      Events.delete_event(event)
    else
      nil ->
        {:error, "event not found"}
    end
  end

  def clone(_parent, %{id: id}, _ctx) do
    with %Event{} = event <- Events.get_event(id) do
      Events.clone_event(event)
    else
      nil ->
        {:error, "event not found"}
    end
  end
end
