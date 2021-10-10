defmodule SoziselWeb.Schema.Mutations.SessionResourceMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.{SessionResources.SessionResource, SessionResourceLinks.SessionResourceLink}
  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResourceResolvers}

  object :session_resource_mutations do
    @desc "Upload session_resource by presenter"
    field :upload_session_resource, :session_resource do
      arg :resource, non_null(:upload)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.upload_resource/3
    end

    @desc "Delete session_resource by presenter"
    field :delete_session_resource, :session_resource do
      @desc "Resource's id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:modify_session_resource, SessionResource}
      resolve &SessionResourceResolvers.delete_resource/3
    end

    @desc "Attach session_resource to the session as session_resource_link"
    field :attach_resource_to_session, :session_resource_link do
      arg :input, non_null(:session_resource_link_input)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.attach_resource_to_session/3
    end

    @desc "Detach session_resource_link from session"
    field :detach_resource_session_link, :session_resource_link do
      @desc "Session resource link's id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization,
                 {:modify_session_resource_link, SessionResourceLink}

      resolve &SessionResourceResolvers.detach_resource_session_link/3
    end

    @desc "Change access for session_resource_link"
    field :change_access_session_resource_link, :session_resource_link do
      @desc "Session resource link's id"
      arg :id, non_null(:id)
      arg :is_public, non_null(:boolean)

      middleware Middleware.ResourceAuthorization,
                 {:modify_session_resource_link, SessionResourceLink}

      resolve &SessionResourceResolvers.change_access_resource/3
    end
  end
end
