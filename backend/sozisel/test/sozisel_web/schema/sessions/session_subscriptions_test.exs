defmodule SoziselWeb.Schema.Events.SessionSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

  import Sozisel.Factory

  @session_notification """
  subscription SessionNotifications($participantToken: String!) {
    sessionNotifications(participantToken: $participantToken) {
      sessionNotificationInfo {
        info
      }
    }
  }
  """

  describe "Session subscriptions should" do
    setup do
      user = insert(:user)
      session = insert(:session, user_id: user.id)
      participant = insert(:participant, session_id: session.id)

      [session: session, participant: participant, user: user]
    end

    test "broadcast info to all participants in session", ctx do
      socket = test_socket()

      variables = %{
        participantToken: ctx.participant.token
      }

      sub = run_subscription(socket, @session_notification, variables)

      # broadcast to a whole session
      Helpers.subscription_publish(
        :session_notifications,
        Topics.session_events(ctx.session.id),
        %{info: "SESSION_END"}
      )

      assert %{
               data: %{
                 "sessionNotifications" => _
               }
             } = receive_subscription(sub)
    end
  end
end
