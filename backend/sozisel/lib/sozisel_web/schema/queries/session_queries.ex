defmodule SoziselWeb.Schema.Queries.SessionQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResolvers}

  object :session_queries do
    field :search_sessions, strong_list_of(:session) do
      arg :input, non_null(:search_sessions_input)

      middleware Middleware.Authorization
      resolve &SessionResolvers.search/3
    end
  end
end
