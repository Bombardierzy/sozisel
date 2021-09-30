defmodule SoziselWeb.Schema.Events.Whiteboards.WhiteboardQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @whiteboard_summary_query """
  query GetWhiteboardSummary($id: ID!) {
    whiteboardSummary(id: $id) {
      id
      task
      participants_whiteboard_tasks {
        full_name
        email
        image_path
        used_time
        additional_text
      }
      average_used_time
    }
  }
  """

  test "returns whiteboard summary" do
    user = insert(:user)
    template = insert(:template)
    event = insert(:whiteboard_event, session_template_id: template.id, user_id: user.id)
    session = insert(:session, session_template_id: template.id, user_id: user.id)
    launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)

    participant1 = insert(:participant, session_id: session.id)
    participant2 = insert(:participant, session_id: session.id)

    insert(:event_result,
      launched_event: launched_event,
      participant: participant1,
      result_data: random_event_result(event.event_data)
    )

    insert(:event_result,
      launched_event: launched_event,
      participant: participant2,
      result_data: random_event_result(event.event_data)
    )

    launched_event_id = launched_event.id
    task = event.event_data.task

    assert %{
             data: %{
               "whiteboardSummary" => %{
                 "id" => ^launched_event_id,
                 "task" => ^task
               }
             }
           } = run_query(test_conn(user), @whiteboard_summary_query, %{id: launched_event.id})
  end
end
