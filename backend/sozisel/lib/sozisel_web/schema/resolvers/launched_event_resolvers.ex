defmodule SoziselWeb.Schema.Resolvers.LaunchedEventResolvers do
  alias Sozisel.Model.{LaunchedEvents, EventResults}
  alias LaunchedEvents.LaunchedEvent

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  def get_quiz_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> EventResults.quiz_summary()
    |> then(&{:ok, &1})
  end

  def get_quiz_participants_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> EventResults.quiz_participants_summary()
    |> then(&{:ok, &1})
  end

  def get_quiz_questions_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> EventResults.quiz_questions_summary()
    |> then(&{:ok, &1})
  end
end
