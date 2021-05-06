defmodule SoziselWeb.Schema.Mutations.SessionMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Sessions.Session
  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResolvers}

  object :session_mutations do
    field :create_session, :session do
      arg :input, non_null(:create_session_input)

      middleware Middleware.Authorization
      resolve &SessionResolvers.create/3
    end

    field :update_session, :session do
      arg :input, non_null(:update_session_input)

      middleware Middleware.ResourceAuthorization, {:update_session, Session}
      resolve &SessionResolvers.update/3
    end

    field :delete_session, :session do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:delete_session, Session}
      resolve &SessionResolvers.delete/3
    end

    field :start_session, :session do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:start_session, Session}
      resolve &SessionResolvers.start_session/3
    end

    field :end_session, :session do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:end_session, Session}
      resolve &SessionResolvers.end_session/3
    end
  end
end
