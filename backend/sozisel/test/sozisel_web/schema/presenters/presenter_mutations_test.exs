defmodule SoziselWeb.Schema.PresenterMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @send_event_to_all """
  mutation SendEventToAll($eventId: ID!, $sessionId: ID!) {
    sendEventToAll(eventId: $eventId, sessionId: $sessionId) {
      id
      session {
          id
      }
      event {
          id
          name
      }
      event_results {
          id
      }
    }
  }
  """
  @send_event_to_listed_participants """
  mutation SendEventToListedParticipants($eventId: ID!, $sessionId: [ID!], $participantIds: [ID!]) {
    sendEventToListedParticipants(eventId: $eventId, sessionId: $sessionId, participantIds: $participantIds) {
      id
      session {
          id
      }
      event {
          id
          name
      }
      event_results {
          id
      }
    }
  }
  """

  describe "Presenter mutations should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    test "send an event to all participants when presenter start event", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)

      variables = %{
        eventId: event.id,
        sessionId: session.id
      }

      session_id = session.id
      event_id = event.id
      event_name = event.name

      assert %{
               data: %{
                 "sendEventToAll" => %{
                   "id" => _,
                   "session" => %{
                     "id" => ^session_id
                   },
                   "event" => %{
                     "id" => ^event_id,
                     "name" => ^event_name
                   },
                   "event_results" => []
                 }
               }
             } = run_query(ctx.conn, @send_event_to_all, variables)
    end

    test "send an event to listed participants when presenter start event", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      participant_1 = insert(:participant, session_id: session.id, token: "First")
      participant_2 = insert(:participant, session_id: session.id, token: "Second")

      variables = %{
        eventId: event.id,
        sessionId: session.id,
        participantIds: [
          participant_1.id,
          participant_2.id
        ]
      }

      session_id = session.id
      event_id = event.id
      event_name = event.name

      assert %{
               data: %{
                 "sendEventToListedParticipants" => %{
                   "id" => _,
                   "session" => %{
                     "id" => ^session_id
                   },
                   "event" => %{
                     "id" => ^event_id,
                     "name" => ^event_name
                   },
                   "event_results" => []
                 }
               }
             } = run_query(ctx.conn, @send_event_to_listed_participants, variables)
    end
  end
end
