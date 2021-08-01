defmodule SoziselWeb.Schema.Resolvers.LaunchedEventResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Model.{Events, Sessions, LaunchedEvents, EventResults}
  alias Events.Event
  alias Sessions.{Template, Session}
  alias LaunchedEvents.LaunchedEvent

  alias Sozisel.Repo

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  def get_quiz_summary(_parent, _args, ctx) do
    quiz_summary =
      fetch_resource!(ctx, LaunchedEvent)
      |> EventResults.quiz_summary()

    {:ok, quiz_summary}
  end

  def get_quiz_participants_summary(_parent, _args, ctx) do
    quiz_participant_summary =
      fetch_resource!(ctx, LaunchedEvent)
      |> EventResults.quiz_participants_summary()

    {:ok, quiz_participant_summary}
  end

  def get_quiz_questions_summary(_parent, _args, ctx) do
    quiz_questions_summary =
      fetch_resource!(ctx, LaunchedEvent)
      |> EventResults.quiz_questions_summary()

    {:ok, quiz_questions_summary}
  end
end
