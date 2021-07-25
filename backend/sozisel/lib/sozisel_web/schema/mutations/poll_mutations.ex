defmodule SoziselWeb.Schema.Mutations.PollMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Events.Event
  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :poll_mutations do
    field :create_poll, :event do
      arg :input, non_null(:create_poll_input)

      middleware Middleware.Authorization
      resolve &EventResolvers.create/3
    end

    field :update_poll, :event do
      arg :input, non_null(:update_poll_input)

      middleware Middleware.ResourceAuthorization, {:update_event, Event}
      resolve &EventResolvers.update/3
    end

    field :delete_poll, :event do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:delete_event, Event}
      resolve &EventResolvers.delete/3
    end
  end
end
