defmodule SoziselWeb.Schema.Mutations.SessionMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middlewares, Resolvers.SessionResolvers}

  object :session_mutations do
    field :create_session, :session do
      arg :input, non_null(:create_session_input)

      middleware Middlewares.Authorization
      resolve &SessionResolvers.create/3
    end

    field :update_session_template, :session do
      arg :input, non_null(:update_session_input)

      middleware Middlewares.Authorization
      resolve &SessionResolvers.update/3
    end

    field :delete_session_template, :session do
      arg :id, non_null(:id)
      middleware Middlewares.Authorization
      resolve &SessionResolvers.delete/3
    end

    field :start_session, :session do
      arg :id, non_null(:id)
      middleware Middlewares.Authorization
      resolve &SessionResolvers.start_session/3
    end

    field :finalize_session, :session do
      arg :id, non_null(:id)
      middleware Middlewares.Authorization
      resolve &SessionResolvers.finalize_session/3
    end
  end
end
