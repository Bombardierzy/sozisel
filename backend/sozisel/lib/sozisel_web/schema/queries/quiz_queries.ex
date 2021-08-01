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

    field :quiz_participants_summary, strong_list_of(:quiz_participant_summary) do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_launched_event, LaunchedEvent}
      resolve &LaunchedEventResolvers.get_quiz_participants_summary/3
    end

    field :quiz_questions_summary, strong_list_of(:quiz_question_summary) do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_launched_event, LaunchedEvent}
      resolve &LaunchedEventResolvers.get_quiz_questions_summary/3
    end
  end
end
