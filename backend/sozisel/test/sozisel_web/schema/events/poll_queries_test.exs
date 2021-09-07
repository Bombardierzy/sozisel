defmodule SoziselWeb.Schema.Polls.PollQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @poll_summary_query """
  query GetPollSummary($id: ID!) {
    pollSummary(id: $id) {
      id
      question
      optionSummaries {
        id
        text
        votes
      }
      isMultiChoice
      totalVoters
    }
  }
  """

  test "returns poll summary" do
    user = insert(:user)
    template = insert(:template)
    event = insert(:poll_event, session_template_id: template.id, user_id: user.id)
    session = insert(:session, session_template_id: template.id, user_id: user.id)
    launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
    participant1 = insert(:participant, session_id: session.id)

    insert(:event_result,
      launched_event: launched_event,
      participant: participant1,
      result_data: random_event_result(event.event_data)
    )

    id = launched_event.id
    question = event.event_data.question

    assert %{
             data: %{
               "pollSummary" => %{
                 "id" => ^id,
                 "question" => ^question,
                 "totalVoters" => 1
               }
             }
           } = run_query(test_conn(user), @poll_summary_query, %{id: launched_event.id})
  end
end
