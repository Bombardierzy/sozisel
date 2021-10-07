defmodule SoziselWeb.Schema.Subscriptions.EventSubscriptions do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Repo
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent
  alias Sozisel.Model.Polls.PollResult
  alias Sozisel.Model.Users.User
  alias SoziselWeb.Schema.Middleware.Subscriptions.{Participant, Presenter}
  alias SoziselWeb.Schema.Subscriptions.Topics

  import SoziselWeb.Schema.Middleware.Subscription

  object :participant_event_subscriptions do
    field :event_launched, :participant_event do
      arg :participant_token, non_null(:string)

      config subscription_middleware(Participant, [], &handle_participant_topics/2)
    end

    field :live_poll_summary, :poll_summary do
      arg :participant_token, non_null(:string)
      arg :launched_event_id, non_null(:string)

      trigger :submit_poll_result,
        topic: fn %{launched_event_id: launched_event_id} ->
          Topics.poll(launched_event_id)
        end

      # This resolver will run for each participant (executing N queries) but we should not care really
      resolve fn %{launched_event_id: id}, _, _ ->
        {:ok, PollResult.poll_summary(id)}
      end

      config subscription_middleware(Participant, [], &handle_participant_poll_topic/2)
    end
  end

  object :presenter_event_subscriptions do
    field :event_result_submitted, :presenter_event_result do
      arg :session_id, non_null(:id)

      config subscription_middleware(Presenter, [], &handle_presenter_topics/2)
    end
  end

  def handle_participant_topics(_args, %{context: %{session_id: sid, participant_id: pid}}) do
    {:ok, topic: [Topics.session_all_participants(sid), Topics.session_participant(sid, pid)]}
  end

  def handle_presenter_topics(%{session_id: session_id}, %{
        context: %{current_user: %User{id: user_id}}
      }) do
    {:ok, topic: [Topics.session_presenter(session_id, user_id)]}
  end

  def handle_participant_poll_topic(%{launched_event_id: launched_event_id}, %{
        context: %{session_id: sid}
      }) do
    with %LaunchedEvent{session_id: ^sid} <- Repo.get(LaunchedEvent, launched_event_id) do
      {:ok, topic: Topics.poll(launched_event_id)}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end
end
