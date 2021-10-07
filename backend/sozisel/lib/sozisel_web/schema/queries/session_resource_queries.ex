defmodule SoziselWeb.Schema.Queries.SessionResourceQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResourceResolvers}
  alias Sozisel.Model.SessionResources.SessionResource

  object :session_resource_queries do
    field :files, strong_list_of(:file) do
      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.get_files/3
    end

    field :session_resources_presenter, strong_list_of(:session_resource_for_presenter) do
      @desc "Session's id"
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.get_presenter_session_resources/3
    end

    field :session_resources_participant, strong_list_of(:session_resource_for_participant) do
      @desc "Session's id"
      arg :id, non_null(:id)
      arg :token, non_null(:string)

      middleware Middleware.Participant
      resolve &SessionResourceResolvers.get_participant_session_resources/3
    end

    field :download_session_resource_presenter, :download_session_resource do
      @desc "Session resource's id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_session_resource, SessionResource}
      resolve &SessionResourceResolvers.download_session_resource_presenter/3
    end

    field :download_session_resource_participant, :download_session_resource do
      @desc "Session resource link's id"
      arg :id, non_null(:id)
      arg :token, non_null(:string)

      middleware Middleware.Participant
      resolve &SessionResourceResolvers.download_session_resource_participant/3
    end
  end
end
