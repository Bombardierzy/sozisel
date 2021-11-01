defmodule SoziselWeb.Schema.Events.Quizzes.QuizMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events.Event

  @create_quiz """
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
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

  @update_quiz """
  mutation UpdateQuiz($input: UpdateQuizInput!) {
    updateQuiz(input: $input) {
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
    }
  }
  """

  @delete_quiz """
  mutation DeleteQuiz($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
    }
  }
  """

  @valid_attrs_for_quiz_event %{
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

  @valid_attrs_for_update_quiz_event %{
    name: "updated event",
    duration_time_sec: 42,
    start_minute: 50,
    event_data: %{
      target_percentage_of_participants: 25,
      quiz_questions: %{
        question: "Updated question?",
        id: "1",
        answers: [
          %{text: "Fourth", id: "1"},
          %{text: "Fifth", id: "2"},
          %{text: "Sixth", id: "3"}
        ],
        correct_answers: [
          %{text: "Fifth", id: "2"},
          %{text: "Sixth", id: "3"}
        ]
      }
    }
  }

  describe "Quiz mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      [conn: test_conn(user), user: user, template: template]
    end

    test "create a new quiz", ctx do
      valid_attrs = Map.put(@valid_attrs_for_quiz_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      session_template_id = ctx.template.id

      assert %{
               data: %{
                 "createQuiz" => %{
                   "id" => _,
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
                     "id" => ^session_template_id
                   }
                 }
               }
             } = run_query(ctx.conn, @create_quiz, variables)
    end

    test "update an existing event", ctx do
      quiz = insert(:quiz_event, session_template_id: ctx.template.id)

      valid_attrs = Map.put(@valid_attrs_for_update_quiz_event, :id, quiz.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "updateQuiz" => %{
                   "id" => _,
                   "name" => "updated event",
                   "durationTimeSec" => 42,
                   "startMinute" => 50,
                   "eventData" => %{
                     "targetPercentageOfParticipants" => 25,
                     "quizQuestions" => quiz_questions
                   }
                 }
               }
             } = run_query(ctx.conn, @update_quiz, variables)

      assert quiz_questions |> length == 1
    end

    test "soft delete an existing quiz event", ctx do
      %{
        id: quiz_id,
        name: quiz_name
      } = insert(:quiz_event, session_template_id: ctx.template.id)

      variables = %{
        id: quiz_id
      }

      assert %{
               data: %{
                 "deleteEvent" => %{
                   "id" => ^quiz_id,
                   "name" => ^quiz_name
                 }
               }
             } = run_query(ctx.conn, @delete_quiz, variables)

      assert Repo.get(Event, quiz_id) == nil
    end

    test "forbid create quiz event by unauthorized user", ctx do
      valid_attrs = Map.put(@valid_attrs_for_quiz_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "createQuiz" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(), @create_quiz, variables)
    end

    test "forbid update/delete quiz event by non-owner", ctx do
      quiz = insert(:quiz_event, session_template_id: ctx.template.id)

      other_user = insert(:user)
      other_conn = test_conn(other_user)

      valid_attrs = Map.put(@valid_attrs_for_update_quiz_event, :id, quiz.id)

      variables = %{
        input: valid_attrs
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @update_quiz, variables)

      variables = %{
        id: quiz.id
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @delete_quiz, variables)
    end
  end
end
