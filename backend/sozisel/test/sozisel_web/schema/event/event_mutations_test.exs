defmodule SoziselWeb.Schema.EventMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events

  @create_event """
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      name
      start_minute
      event_type {
        duration_time_sec
        target_percentage_of_participants
        tracking_mode
        quiz_questions {
            question
            answers
            correct_answers
        }
      }
      session_template_id
    }
  }
  """

  @update_event """
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      name
      start_minute
      event_type {
        duration_time_sec
        target_percentage_of_participants
        tracking_mode
        quiz_questions {
            question
            answers
            correct_answers
        }
      }
    }
  }
  """

  @delete_event """
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
    }
  }
  """

  @clone_event """
  mutation CloneEvent($id: ID!) {
    cloneEvent(id: $id) {
      id
      name
    }
  }
  """

  @valid_attrs %{
      name: "some name",
      start_minute: 42,
      event_type: %{
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

  describe "Event mutations should" do
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

    test "create a new event", ctx do

      template = insert(:template)

      variables = %{
        input: %{
            name: "event",
            start_minute: 10,
            event_type: %{
                duration_time_sec: 25,
                target_percentage_of_participants: 90,
                tracking_mode: true,
                quiz_questions: [%{
                    question: "First question?",
                    answers: ["First", "Second", "Third"],
                    correct_answers: ["Second"]
                }],
            },
            session_template_id: template.id,
        }
      }

      assert %{
               data: %{
                 "createEvent" => %{
                   "id" => _,
                   "name" => "event",
                   "start_minute" => 10,
                   "event_type" => %{
                       "duration_time_sec" => 25,
                       "target_percentage_of_participants" => 90,
                       "tracking_mode" => true,
                       "quiz_questions" => [%{
                           "question" => "First question?",
                           "answers" => ["First", "Second", "Third"],"correct_answers" => ["Second"]
                       }],
                   }
                 }
               }
             } = run_query(ctx.conn, @create_event, variables)
    end

    test "update an existing event", ctx do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})

      variables = %{
        input: %{
            id: event.id,
            name: "updated_event",
            start_minute: 50,
            event_type: %{
                duration_time_sec: 42,
                target_percentage_of_participants: 25,
                tracking_mode: false,
                quiz_questions: %{
                    question: "Updated question?",
                    answers: ["Fourth", "Fifth", "Sixth"],
                    correct_answers: ["Fifth", "Sixth"]
                }
            },
        }
      }

      assert %{
               data: %{
                 "updateEvent" => %{
                   "id" => _,
                   "name" => "updated_event",
                   "start_minute" => 50,
                   "event_type" => %{
                       "duration_time_sec" => 42,
                       "target_percentage_of_participants" => 25,
                       "tracking_mode" => false,
                       "quiz_questions" => quiz_questions,
                   }
                 }
               }
             } = run_query(ctx.conn, @update_event, variables)

    assert quiz_questions |> length == 1

    end

    test "soft delete an existing template", ctx do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})

      name = event.name

      variables = %{
        id: event.id
      }

      assert %{
               data: %{
                 "deleteEvent" => %{
                   "id" => _,
                   "name" => ^name
                 }
               }
             } = run_query(ctx.conn, @delete_event, variables)

    end

    test "clone event", ctx do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})

      name = event.name

      variables = %{
        id: event.id
      }

      assert %{
               data: %{
                 "cloneEvent" => %{
                   "id" => id,
                   "name" => ^name
                 }
               }
             } = run_query(ctx.conn, @clone_event, variables)

      assert id != event.id
    end
  end
end