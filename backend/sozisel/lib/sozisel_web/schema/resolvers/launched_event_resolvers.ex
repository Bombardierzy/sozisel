defmodule SoziselWeb.Schema.Resolvers.LaunchedEventResolvers do
  alias Sozisel.Model.{
    LaunchedEvents,
    Quizzes.QuizResult,
    Polls.PollResult,
    Whiteboards.WhiteboardResult
  }

  alias LaunchedEvents.LaunchedEvent

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  def get_quiz_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> QuizResult.quiz_summary()
    |> then(&{:ok, &1})
  end

  def get_quiz_participants_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> QuizResult.quiz_participants_summary()
    |> then(&{:ok, &1})
  end

  def get_quiz_questions_summary(_parent, _args, ctx) do
    fetch_resource!(ctx, LaunchedEvent)
    |> QuizResult.quiz_questions_summary()
    |> then(&{:ok, &1})
  end

  def poll_summary(_parent, %{id: launched_event_id}, _ctx) do
    {:ok, PollResult.poll_summary(launched_event_id)}
  end

  def whiteboard_summary(_parent, %{id: launched_event_id}, _ctx) do
    {:ok, WhiteboardResult.whiteboard_summary(launched_event_id)}
  end
end
