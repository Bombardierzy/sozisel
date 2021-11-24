defmodule SoziselWeb.Schema.Queries.SessionResourceQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionResourceResolvers}

  object :session_resource_queries do
    @desc "Return list of session_resource_links for presenter during session"
    field :presenter_session_resources, strong_list_of(:session_resource_link) do
      @desc "Session's id"
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionResourceResolvers.get_presenter_session_resources/3
    end

    @desc "Return list of session_resource_links for participant during session"
    field :participant_session_resources, strong_list_of(:session_resource_link) do
      @desc "Session's id"
      arg :id, non_null(:id)
      arg :token, non_null(:string)
      arg :timestamp, :string

      middleware Middleware.Participant
      resolve &SessionResourceResolvers.get_participant_session_resources/3
    end
  end
end
