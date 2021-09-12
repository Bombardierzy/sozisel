defmodule SoziselWeb.Schema.Queries.SessionQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
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

    field :poll_summary, :poll_summary do
      @desc "Poll's launched event id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_poll_summary, LaunchedEvent}

      resolve &SessionResolvers.poll_summary/3
    end

    field :session_thumbnail, :session_thumbnail do
      arg :id, non_null(:id)

      resolve &SessionResolvers.get_session_thumbnail/3
    end

    # it is ok to expose session recording as the query's user
    # has to know UUID which can be shared to the public
    # by the recording's owner so don't protect it
    field :session_recording, :session_recording do
      arg :id, non_null(:id)

      resolve &SessionResolvers.get_session_recording/3
    end
  end
end
