defmodule SoziselWeb.Schema.EventQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events

  @get_event """
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      startMinute
      eventData {
        ... on Quiz {
          durationTimeSec
          targetPercentageOfParticipants
          trackingMode
          quizQuestions {
              question
              answers
              correctAnswers
          }
        }
      }
      sessionTemplate {
        id
      }
    }
  }
  """

  @valid_attrs %{
    name: "some name",
    start_minute: 42,
    event_data: %{
      duration_time_sec: 12,
      target_percentage_of_participants: 2,
      tracking_mode: true,
      quiz_questions: [
        %{
          question: "What is the capital of Poland?",
          answers: ["Cracow", "Warsaw", "Podlasie"],
          correct_answers: ["Warsaw"]
        }
      ]
    }
  }

  describe "Event queries should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    def event_fixture(attrs \\ %{}) do
      {:ok, event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Events.create_event()

      event
    end

    test "return event with given id", ctx do
      template = insert(:template, user_id: ctx.user.id)
      event_id = event_fixture(%{session_template_id: template.id}).id

      assert %{
               data: %{
                 "event" => %{
                   "id" => ^event_id,
                   "name" => "some name",
                   "startMinute" => 42,
                   "eventData" => %{
                     "durationTimeSec" => 12,
                     "targetPercentageOfParticipants" => 2,
                     "trackingMode" => true,
                     "quizQuestions" => [
                       %{
                         "question" => "What is the capital of Poland?",
                         "answers" => ["Cracow", "Warsaw", "Podlasie"],
                         "correctAnswers" => ["Warsaw"]
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
  end
end
