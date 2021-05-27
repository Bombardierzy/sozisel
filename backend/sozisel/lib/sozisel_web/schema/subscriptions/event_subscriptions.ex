defmodule SoziselWeb.Schema.Subscriptions.EventSubscriptions do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Middleware.Subscriptions.Participant
  alias SoziselWeb.Schema.Subscriptions.Topics

  import SoziselWeb.Schema.Middleware.Subscription

  object :participant_event_subscriptions do
    field :event_launched, :participant_event do
      arg :participant_token, non_null(:string)

      config subscription_middleware(Participant, [], fn _args,
                                                         %{
                                                           context: %{
                                                             session_id: sid,
                                                             participant_id: pid
                                                           }
                                                         } ->
               {:ok,
                topic: [Topics.session_events(sid), Topics.session_participant_events(sid, pid)]}
             end)

      # config subscription_middleware(Participant, [], fn _args, %{context: %{session_id: sid, participant_id: pid}} ->
      #   {:ok, topic: [Topics.session_events(sid), Topics.session_participant_events(sid, pid)]}
      # end)
    end
  end

  # object :presenter_event_subscriptions do
  # end
end
