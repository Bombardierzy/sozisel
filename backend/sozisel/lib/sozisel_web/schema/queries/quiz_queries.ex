defmodule SoziselWeb.Schema.Queries.QuizQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias SoziselWeb.Schema.{Middleware, Resolvers.LaunchedEventResolvers}

  object :quiz_queries do
    field :quiz_summary, :quiz_summary do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_launched_event, LaunchedEvent}
      resolve &LaunchedEventResolvers.get_quiz_summary/3
    end

    # field :event_result_details, strong_list_of(:event_result) do
    #   arg :id, non_null(:id)

    #   middleware Middleware.Authorization
    #   resolve &EventResolvers.event_details/3
    # end
  end
end
