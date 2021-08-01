defmodule SoziselWeb.Schema.QuizMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events

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
    deleteQuiz(id: $id) {
      id
      name
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

  describe "Quiz mutations should" do
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

    test "create a new quiz", ctx do
      template = insert(:template, user_id: ctx.user.id)

      variables = %{
        input: %{
          name: "event",
          durationTimeSec: 25,
          startMinute: 10,
          eventData: %{
            targetPercentageOfParticipants: 90,
            quizQuestions: [
              %{
                question: "First question?",
                id: "1",
                answers: [
                  %{text: "First", id: "1"},
                  %{text: "Second", id: "2"},
                  %{text: "Third", id: "3"}
                ],
                correct_answers: [
                  %{text: "Second", id: "2"}
                ]
              }
            ]
          },
          sessionTemplateId: template.id
        }
      }

      assert %{
               data: %{
                 "createQuiz" => %{
                   "id" => _,
                   "name" => "event",
                   "durationTimeSec" => 25,
                   "startMinute" => 10,
                   "eventData" => %{
                     "targetPercentageOfParticipants" => 90,
                     "quizQuestions" => [
                       %{
                         "question" => "First question?",
                         "id" => "1",
                         "answers" => [
                           %{"id" => "1", "text" => "First"},
                           %{"id" => "2", "text" => "Second"},
                           %{"id" => "3", "text" => "Third"}
                         ],
                         "correctAnswers" => [
                           %{"id" => "2", "text" => "Second"}
                         ]
                       }
                     ]
                   },
                   "sessionTemplate" => %{
                     "id" => _
                   }
                 }
               }
             } = run_query(ctx.conn, @create_quiz, variables)
    end

    test "update an existing event", ctx do
      template = insert(:template, user_id: ctx.user.id)
      event = event_fixture(%{session_template_id: template.id})

      variables = %{
        input: %{
          id: event.id,
          name: "updated event",
          durationTimeSec: 42,
          startMinute: 50,
          eventData: %{
            targetPercentageOfParticipants: 25,
            quizQuestions: %{
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

    test "soft delete an existing event", ctx do
      template = insert(:template, user_id: ctx.user.id)
      event = event_fixture(%{session_template_id: template.id})

      name = event.name

      variables = %{
        id: event.id
      }

      assert %{
               data: %{
                 "deleteQuiz" => %{
                   "id" => _,
                   "name" => ^name
                 }
               }
             } = run_query(ctx.conn, @delete_quiz, variables)
    end

    test "forbid create by unauthorized user", ctx do
      template = insert(:template, user_id: ctx.user.id)

      variables = %{
        input: %{
          name: "event",
          durationTimeSec: 25,
          startMinute: 10,
          eventData: %{
            targetPercentageOfParticipants: 90,
            quizQuestions: [
              %{
                question: "First question?",
                id: "1",
                answers: [
                  %{text: "First", id: "1"},
                  %{text: "Second", id: "2"},
                  %{text: "Third", id: "3"}
                ],
                correct_answers: [
                  %{text: "Second", id: "2"}
                ]
              }
            ]
          },
          sessionTemplateId: template.id
        }
      }

      assert %{
               data: %{
                 "createQuiz" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(), @create_quiz, variables)
    end

    test "forbid update/delete by non-owner", ctx do
      template = insert(:template, user_id: ctx.user.id)
      event = event_fixture(%{session_template_id: template.id})
      other_user = insert(:user)
      other_conn = test_conn(other_user)

      variables = %{
        input: %{
          id: event.id,
          name: "updated event",
          durationTimeSec: 42,
          startMinute: 50,
          eventData: %{
            targetPercentageOfParticipants: 25,
            quizQuestions: %{
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
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @update_quiz, variables)

      variables = %{
        id: event.id
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @delete_quiz, variables)
    end
  end
end
