defmodule SoziselWeb.Schema.Queries.EventQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.EventResolvers}

  object :event_queries do
    field :event, :event do
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &EventResolvers.get_event/3
    end

    field :search_sessions, strong_list_of(:session) do
      arg :input, non_null(:search_sessions_input)

      middleware Middleware.Authorization
      resolve &SessionResolvers.search/3
    end
  end
end
