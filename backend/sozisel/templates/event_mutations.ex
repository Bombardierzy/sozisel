defmodule SoziselWeb.Schema.Mutations.<%= @module %>Mutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Events.Event
  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :<%= @event_name %>_mutations do
    field :create_<%= @event_name %>, :event do
      arg :input, non_null(:create_<%= @event_name %>_input)

      middleware Middleware.Authorization
      resolve &EventResolvers.create/3
    end

    field :update_<%= @event_name %>, :event do
      arg :input, non_null(:update_<%= @event_name %>_input)

      middleware Middleware.ResourceAuthorization, {:update_event, Event}
      resolve &EventResolvers.update/3
    end
  end
end
