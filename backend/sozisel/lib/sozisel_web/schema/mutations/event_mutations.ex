defmodule SoziselWeb.Schema.Mutations.EventMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Events.Event
  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :event_mutations do
    field :delete_event, :event do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:delete_event, Event}
      resolve &EventResolvers.delete/3
    end
  end
end
