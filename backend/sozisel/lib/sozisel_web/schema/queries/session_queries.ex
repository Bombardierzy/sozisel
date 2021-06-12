defmodule SoziselWeb.Schema.Queries.SessionQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Sessions.Session
  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResolvers}

  object :session_queries do
    field :session, :session do
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResolvers.get_session/3
    end

    field :search_sessions, strong_list_of(:session) do
      arg :input, non_null(:search_sessions_input)

      middleware Middleware.Authorization
      resolve &SessionResolvers.search/3
    end

    field :session_summary, :session_summary do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_session_summary, Session}
      resolve &SessionResolvers.session_summary/3
    end

    field :session_thumbnail, :session_thumbnail do
      arg :id, non_null(:id)

      resolve &SessionResolvers.get_session_thumbnail/3
    end
  end
end
