defmodule SoziselWeb.Schema.Presenters.PresenterMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @launch_event """
  mutation LaunchEvent($eventId: ID!, $sessionId: [ID!], $broadcast: Boolean!, $targetParticipants: [ID!]) {
    launchEvent(eventId: $eventId, sessionId: $sessionId, broadcast: $broadcast, targetParticipants: $targetParticipants) {
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
      template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: template.id, user_id: user.id)

      event = insert(:random_event, session_template_id: template.id)

      [conn: test_conn(user), user: user, template: template, event: event, session: session]
    end

    test "send an event to all participants when presenter start event", ctx do
      variables = %{
        eventId: ctx.event.id,
        sessionId: ctx.session.id,
        broadcast: true
      }

      session_id = ctx.session.id
      event_id = ctx.event.id
      event_name = ctx.event.name

      assert %{
               data: %{
                 "launchEvent" => %{
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
             } = run_query(ctx.conn, @launch_event, variables)
    end

    test "send an event to listed participants when presenter start event", ctx do
      %{session: session, event: event} = ctx
      participant_1 = insert(:participant, session_id: session.id)
      participant_2 = insert(:participant, session_id: session.id)

      variables = %{
        eventId: event.id,
        sessionId: session.id,
        broadcast: false,
        targetParticipants: [
          participant_1.id,
          participant_2.id
        ]
      }

      session_id = session.id
      event_id = event.id
      event_name = event.name

      assert %{
               data: %{
                 "launchEvent" => %{
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
             } = run_query(ctx.conn, @launch_event, variables)
    end

    test "return an error when somebody tries to launch event twice", ctx do
      variables = %{
        eventId: ctx.event.id,
        sessionId: ctx.session.id,
        broadcast: true
      }

      assert %{data: %{"launchEvent" => %{}}} = run_query(ctx.conn, @launch_event, variables)

      assert %{
               data: %{"launchEvent" => nil},
               errors: [%{"message" => "Event is already launched"}]
             } = run_query(ctx.conn, @launch_event, variables)
    end
  end
end
