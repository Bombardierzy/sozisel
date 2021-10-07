defmodule SoziselWeb.Schema.Mutations.SessionResourceMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResourceResolvers}

  object :session_resource_mutations do
    field :upload_session_resource, :string do
      arg :resource, non_null(:upload)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.upload_resource/3
    end

    field :delete_session_resource, :string do
      @desc "Resource's id"
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.delete_resource/3
    end

    field :attach_resource_to_session, :session_resource_link do
      arg :input, non_null(:session_resource_link_input)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.attach_resource_to_session/3
    end

    field :change_access_session_resource_link, :string do
      @desc "Session resource link's id"
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.change_access_resource/3
    end

    field :detach_resource_from_session, :string do
      @desc "Session resource link's id"
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.detach_resource_from_session/3
    end
  end
end
