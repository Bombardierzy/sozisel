defmodule SoziselWeb.Schema.Events.Quizzes.QuizQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @get_quiz_summary """
  query GetQuizSummary($id: ID!) {
    quizSummary(id: $id) {
        numberOfParticipants
        averagePoints
        averageQuizAnswerTime
    }
  }
  """

  @get_quiz_participants_summary """
  query GetQuizParticipantsSummary($id: ID!) {
    quizParticipantsSummary(id: $id) {
        fullName
        email
        numberOfPoints
        quizAnswerTime
        participantAnswers {
            questionId
            finalAnswerIds
            points
            trackNodes {
                reactionTime
                answerId
                selected
            }
        }
    }
  }
  """

  @get_quiz_questions_summary """
  query GetQuizQuestionsSummary($id: ID!) {
    quizQuestionsSummary(id: $id) {
        questionId
        question
        answers {
            id
            text
        }
        correctAnswers { 
            id
            text
        }
        averagePoint
        averageAnswerTime
        participantsAnswers {
            fullName
            email
            points
            answerTime
            finalAnswerIds
            trackNodes {
                reactionTime
                answerId
                selected
            }
        }
    }
  }
  """

  describe "Quiz queries should" do
    setup do
      user = insert(:user)
      template = insert(:template)
      event = insert(:quiz_event, session_template_id: template.id)
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

      [conn: test_conn(user), launched_event: launched_event]
    end

    test "get quiz summary after summary session", ctx do
      variables = %{
        id: ctx.launched_event.id
      }

      assert %{
               data: %{
                 "quizSummary" => %{
                   "averageQuizAnswerTime" => _,
                   "averagePoints" => _,
                   "numberOfParticipants" => 2
                 }
               }
             } = run_query(ctx.conn, @get_quiz_summary, variables)
    end

    test "get quiz participants summary after summary session", ctx do
      variables = %{
        id: ctx.launched_event.id
      }

      assert %{
               data: %{
                 "quizParticipantsSummary" => [
                   %{
                     "quizAnswerTime" => _,
                     "email" => _,
                     "fullName" => _,
                     "numberOfPoints" => _,
                     "participantAnswers" => _
                   },
                   %{
                     "quizAnswerTime" => _,
                     "email" => _,
                     "fullName" => _,
                     "numberOfPoints" => _,
                     "participantAnswers" => _
                   }
                 ]
               }
             } = run_query(ctx.conn, @get_quiz_participants_summary, variables)
    end

    test "get quiz questions summary after summary session", ctx do
      variables = %{
        id: ctx.launched_event.id
      }

      assert %{
               data: %{
                 "quizQuestionsSummary" => [
                   %{
                     "answers" => [
                       %{
                         "id" => "1",
                         "text" => "Jakub Perżyło"
                       },
                       %{"id" => "2", "text" => "Przemysław Wątroba"},
                       %{"id" => "3", "text" => "Jakub Myśliwiec"},
                       %{"id" => "4", "text" => "Sebastian Kuśnierz"},
                       %{"id" => "5", "text" => "Flaneczki Team"}
                     ],
                     "averageAnswerTime" => 12.4,
                     "averagePoint" => 0.53,
                     "correctAnswers" => [
                       %{"id" => "1", "text" => "Jakub Perżyło"},
                       %{"id" => "2", "text" => "Przemysław Wątroba"},
                       %{"id" => "3", "text" => "Jakub Myśliwiec"},
                       %{"id" => "4", "text" => "Sebastian Kuśnierz"}
                     ],
                     "participantsAnswers" => [
                       %{
                         "answerTime" => 12.4,
                         "email" => _,
                         "finalAnswerIds" => _,
                         "fullName" => _,
                         "points" => 0.53,
                         "trackNodes" => []
                       },
                       %{
                         "answerTime" => 12.4,
                         "email" => _,
                         "finalAnswerIds" => _,
                         "fullName" => _,
                         "points" => 0.53,
                         "trackNodes" => []
                       }
                     ],
                     "question" => "Kto jest twórcą Sozisela?",
                     "questionId" => "1"
                   },
                   %{
                     "answers" => [
                       %{"id" => "1", "text" => "1/3 * x^3"},
                       %{"id" => "2", "text" => "1/3 * x^3 + C"},
                       %{"id" => "3", "text" => "2x"}
                     ],
                     "averageAnswerTime" => 12.4,
                     "averagePoint" => 0.53,
                     "correctAnswers" => [%{"id" => "2", "text" => "1/3 * x^3 + C"}],
                     "participantsAnswers" => [
                       %{
                         "answerTime" => 12.4,
                         "email" => _,
                         "finalAnswerIds" => _,
                         "fullName" => _,
                         "points" => 0.53,
                         "trackNodes" => []
                       },
                       %{
                         "answerTime" => 12.4,
                         "email" => _,
                         "finalAnswerIds" => _,
                         "fullName" => _,
                         "points" => 0.53,
                         "trackNodes" => []
                       }
                     ],
                     "question" => "Całka z x^2?",
                     "questionId" => "2"
                   }
                 ]
               }
             } = run_query(ctx.conn, @get_quiz_questions_summary, variables)
    end
  end
end
