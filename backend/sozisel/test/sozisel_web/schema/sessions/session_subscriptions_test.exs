defmodule SoziselWeb.Schema.Sessions.SessionSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

  import Sozisel.Factory

  @session_notification """
  subscription SessionNotifications($participantToken: String!) {
    sessionNotifications(participantToken: $participantToken) {
      info
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

    test "broadcast info to all participants in session when session has been ended", ctx do
      socket = test_socket()

      variables = %{
        participantToken: ctx.participant.token
      }

      sub = run_subscription(socket, @session_notification, variables)

      # broadcast to a single participant
      Helpers.subscription_publish(
        :session_notifications,
        Topics.session_all_participants(ctx.session.id),
        %{info: :session_end}
      )

      assert %{
               data: %{
                 "sessionNotifications" => %{
                   "info" => "SESSION_END"
                 }
               }
             } = receive_subscription(sub)
    end
  end
end
