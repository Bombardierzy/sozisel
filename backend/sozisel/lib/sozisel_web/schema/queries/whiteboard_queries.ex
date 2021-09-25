defmodule SoziselWeb.Schema.Queries.WhiteboardQueries do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias SoziselWeb.Schema.{Middleware, Resolvers.LaunchedEventResolvers}

  object :whiteboard_queries do
    field :whiteboard_summary, :whiteboard_summary do
      @desc "Whiteboard's launched event id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:query_launched_event, LaunchedEvent}

      resolve &LaunchedEventResolvers.whiteboard_summary/3
    end
  end
end
