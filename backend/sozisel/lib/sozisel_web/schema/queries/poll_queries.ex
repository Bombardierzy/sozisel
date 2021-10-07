defmodule SoziselWeb.Schema.Queries.PollQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias SoziselWeb.Schema.{Middleware, Resolvers.LaunchedEventResolvers}

  object :poll_queries do
    field :poll_summary, :poll_summary do
      @desc "Poll's launched event id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_launched_event, LaunchedEvent}

      resolve &LaunchedEventResolvers.poll_summary/3
    end
  end
end
