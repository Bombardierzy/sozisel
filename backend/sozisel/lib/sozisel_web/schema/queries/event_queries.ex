defmodule SoziselWeb.Schema.Queries.EventQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Events.Event
  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :event_queries do
    field :event, :event do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_event, Event}
      resolve &EventResolvers.get_event/3
    end

    field :event_result_details, strong_list_of(:event_result) do
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &EventResolvers.event_details/3
    end
  end
end
