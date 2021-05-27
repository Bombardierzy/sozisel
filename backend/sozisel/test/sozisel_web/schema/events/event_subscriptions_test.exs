defmodule SoziselWeb.Schema.Events.EventSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

  import Sozisel.Factory

  @participant_event_launched """
  subscription EventLaunched($participantToken: String!) {
    eventLaunched(participantToken: $participantToken) {
      eventData {
        ... on ParticipantQuiz {
          quizQuestions {
            question
            answers {
              id
              text
            }
          }
        }
      }
    }
  }
  """

  def mock_participant_event(session \\ nil) do
    if is_nil(session) do
      build(:event)
    else
      build(:event, session_id: session.id)
    end
  end

  describe "Event subscriptions should" do
    setup do
      session = insert(:session)
      participant = insert(:participant, session_id: session.id)

      [session: session, participant: participant]
    end

    test "be broadcasted to a proper participant", ctx do
      variables = %{
        participantToken: ctx.participant.token
      }

      socket = test_socket()

      sub = run_subscription(socket, @participant_event_launched, variables)

      # broadcast to a whole session
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_events(ctx.session.id),
        mock_participant_event()
      )

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(sub)

      # broadcast to a single participant
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_participant_events(ctx.session.id, ctx.participant.id),
        mock_participant_event()
      )

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(sub)
    end
  end
end
