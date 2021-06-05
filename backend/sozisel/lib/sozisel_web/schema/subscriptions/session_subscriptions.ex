defmodule SoziselWeb.Schema.Subscriptions.SessionSubscriptions do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Middleware.Subscriptions.Participant
  alias SoziselWeb.Schema.Subscriptions.Topics

  import SoziselWeb.Schema.Middleware.Subscription

  object :session_subscriptions do
    field :session_notifications, :session_notification_info do
      arg :participant_token, non_null(:string)

      config subscription_middleware(Participant, [], &handle_session_topics/2)
    end
  end

  def handle_session_topics(_args, %{context: %{session_id: sid}}) do
    {:ok, topic: [Topics.session_all_participants(sid)]}
  end
end
