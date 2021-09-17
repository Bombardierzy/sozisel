defmodule SoziselWeb.Schema.Events.EventQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events

  @get_event """
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      durationTimeSec
      startMinute
      eventData {
        ... on Quiz {
          targetPercentageOfParticipants
          quizQuestions {
              question
              id
              answers {
                text
                id
              }
              correctAnswers {
                text
                id
              }
          }
        }
      }
      sessionTemplate {
        id
      }
    }
  }
  """

  @get_event_details """
  query getEventResultDetails($id: ID!) {
    eventResultDetails(id: $id) {
      id
      participant {
        full_name
        email
      }
      launchedEvent {
        event {
          id
        }
      }
      resultData {
        ... on QuizResult {
          participantAnswers {
            questionId
            finalAnswerIds
          }
        }
      }
    }
  }
  """

  @valid_attrs %{
    name: "some name",
    duration_time_sec: 12,
    start_minute: 42,
    event_data: %{
      target_percentage_of_participants: 2,
      quiz_questions: [
        %{
          question: "What is the capital of Poland?",
          id: "1",
          answers: [
            %{text: "Cracow", id: "1"},
            %{text: "Warsaw", id: "2"},
            %{text: "Podlasie", id: "3"}
          ],
          correct_answers: [
            %{text: "Warsaw", id: "2"}
          ]
        }
      ]
    }
  }

  describe "Event queries should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      [conn: test_conn(user), user: user, template: template]
    end

    def event_fixture(attrs \\ %{}) do
      {:ok, event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Events.create_event()

      event
    end

    test "return event with given id", ctx do
      event_id = event_fixture(%{session_template_id: ctx.template.id}).id

      assert %{
               data: %{
                 "event" => %{
                   "id" => ^event_id,
                   "name" => "some name",
                   "durationTimeSec" => 12,
                   "startMinute" => 42,
                   "eventData" => %{
                     "targetPercentageOfParticipants" => 2,
                     "quizQuestions" => [
                       %{
                         "question" => "What is the capital of Poland?",
                         "id" => "1",
                         "answers" => [
                           %{"id" => "1", "text" => "Cracow"},
                           %{"id" => "2", "text" => "Warsaw"},
                           %{"id" => "3", "text" => "Podlasie"}
                         ],
                         "correctAnswers" => [
                           %{"id" => "2", "text" => "Warsaw"}
                         ]
                       }
                     ]
                   },
                   "sessionTemplate" => %{
                     "id" => _
                   }
                 }
               }
             } = run_query(ctx.conn, @get_event, %{id: event_id})

      other_conn = test_conn(insert(:user))

      assert %{
               data: %{
                 "event" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(other_conn, @get_event, %{id: event_id})
    end

    test "get event details after summary session", ctx do
      event = insert(:quiz_event, session_template_id: ctx.template.id)
      session = insert(:session, session_template_id: ctx.template.id, user_id: ctx.user.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant1 = insert(:participant, session_id: session.id)
      participant2 = insert(:participant, session_id: session.id)

      event_result_id_1 =
        insert(:event_result,
          launched_event: launched_event,
          participant: participant1,
          result_data: random_event_result(event.event_data)
        ).id

      event_result_id_2 =
        insert(:event_result,
          launched_event: launched_event,
          participant: participant2,
          result_data: random_event_result(event.event_data)
        ).id

      email_1 = participant1.email
      full_name_1 = participant1.full_name

      email_2 = participant2.email
      full_name_2 = participant2.full_name

      variables = %{
        id: launched_event.id
      }

      assert %{
               data: %{
                 "eventResultDetails" => [
                   %{
                     "id" => ^event_result_id_1,
                     "participant" => %{
                       "email" => ^email_1,
                       "full_name" => ^full_name_1
                     },
                     "resultData" => _
                   },
                   %{
                     "id" => ^event_result_id_2,
                     "participant" => %{
                       "email" => ^email_2,
                       "full_name" => ^full_name_2
                     },
                     "resultData" => _
                   }
                 ]
               }
             } = run_query(ctx.conn, @get_event_details, variables)
    end

    test "get empty list of event details after summary session", ctx do
      event = insert(:quiz_event, session_template_id: ctx.template.id)
      session = insert(:session, session_template_id: ctx.template.id, user_id: ctx.user.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)

      variables = %{
        id: launched_event.id
      }

      assert %{
               data: %{
                 "eventResultDetails" => []
               }
             } = run_query(ctx.conn, @get_event_details, variables)
    end
  end
end
