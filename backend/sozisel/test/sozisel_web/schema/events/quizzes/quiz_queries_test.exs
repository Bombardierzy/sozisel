defmodule SoziselWeb.Schema.Quizzes.QuizQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @get_quiz_summary """
  query GetQuizSummary($id: ID!) {
    quizSummary(id: $id) {
        numberOfParticipants
        averagePoints
        averageAnswerTime
    }
  }
  """

  describe "Quiz queries should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    test "get quiz summary after summary session", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id, user_id: ctx.user.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant1 = insert(:participant, session_id: session.id)
      participant2 = insert(:participant, session_id: session.id)
      insert(:event_result, launched_event: launched_event, participant: participant1, result_data: random_event_result(event.event_data))
      insert(:event_result, launched_event: launched_event, participant: participant2, result_data: random_event_result(event.event_data))

      variables = %{
        id: launched_event.id
      }

      assert %{
               data: %{
                 "quizSummary" => %{
                     "averageAnswerTime" => 312.2,
                     "averagePoints" => 32.12,
                     "numberOfParticipants" => 32
                 }
               }
             } = run_query(ctx.conn, @get_quiz_summary, variables)
    end

  end
end
