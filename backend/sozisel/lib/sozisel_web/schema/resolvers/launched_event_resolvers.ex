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
    |> EventResults.quiz_result_summary()

    # quiz_sumamry = 
    # %{
    #     number_of_participants: 32,
    #     average_points: 32.12,
    #     average_answer_time: 312.2
    # }

    {:ok, quiz_summary}
  end

#   def create(_parent, %{input: input}, ctx) do
#     user = Context.current_user!(ctx)

#     with %Template{} = template <- Sessions.get_template(input.session_template_id),
#          true <- template.user_id == user.id do
#       Events.create_event(input)
#     else
#       nil -> {:error, "sessions template not found"}
#       false -> {:error, "unauthorized"}
#     end
#   end

#   def update(_parent, %{input: input}, ctx) do
#     fetch_resource!(ctx, Event)
#     |> Events.update_event(input)
#   end

#   def delete(_parent, _args, ctx) do
#     fetch_resource!(ctx, Event)
#     |> Events.delete_event()
#   end

#   def event_details(_parent, %{id: launched_event_id}, ctx) do
#     user_id = Context.current_user!(ctx).id

#     with %LaunchedEvent{} = launched_event <-
#            LaunchedEvents.get_launched_event(launched_event_id),
#          %LaunchedEvent{session: %Session{user_id: ^user_id}} = launched_event <-
#            Repo.preload(launched_event, [:session]) do
#       results =
#         launched_event
#         |> EventResults.get_all_event_results()

#       {:ok, results}
#     else
#       %LaunchedEvent{} -> {:error, :unauthorized}
#       nil -> {:ok, nil}
#     end
#   end
end
