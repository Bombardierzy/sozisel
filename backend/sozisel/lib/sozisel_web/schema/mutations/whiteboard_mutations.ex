defmodule SoziselWeb.Schema.Mutations.WhiteboardMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Events.Event
  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :whiteboard_mutations do
    field :create_whiteboard, :event do
      arg :input, non_null(:create_whiteboard_input)

      middleware Middleware.Authorization
      resolve &EventResolvers.create/3
    end

    field :update_whiteboard, :event do
      arg :input, non_null(:update_whiteboard_input)

      middleware Middleware.ResourceAuthorization, {:update_event, Event}
      resolve &EventResolvers.update/3
    end

    field :delete_whiteboard, :event do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:delete_event, Event}
      resolve &EventResolvers.delete/3
    end
  end
end
