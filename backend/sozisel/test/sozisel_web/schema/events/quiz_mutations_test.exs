defmodule SoziselWeb.Schema.QuizMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events

  @create_quiz """
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
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
      startMinute
      eventData {
        ... on Quiz {
          durationTimeSec
          targetPercentageOfParticipants
          trackingMode
          quizQuestions {
            question
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
    start_minute: 42,
    event_data: %{
      duration_time_sec: 12,
      target_percentage_of_participants: 2,
      tracking_mode: true,
      quiz_questions: [
        %{
          question: "What is the capital of Poland?",
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
          startMinute: 10,
          eventData: %{
            durationTimeSec: 25,
            targetPercentageOfParticipants: 90,
            trackingMode: true,
            quizQuestions: [
              %{
                question: "First question?",
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
                   "startMinute" => 10,
                   "eventData" => %{
                     "durationTimeSec" => 25,
                     "targetPercentageOfParticipants" => 90,
                     "trackingMode" => true,
                     "quizQuestions" => [
                       %{
                         "question" => "First question?",
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
          startMinute: 50,
          eventData: %{
            durationTimeSec: 42,
            targetPercentageOfParticipants: 25,
            tracking_mode: false,
            quizQuestions: %{
              question: "Updated question?",
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
                   "startMinute" => 50,
                   "eventData" => %{
                     "durationTimeSec" => 42,
                     "targetPercentageOfParticipants" => 25,
                     "trackingMode" => false,
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
          startMinute: 10,
          eventData: %{
            durationTimeSec: 25,
            targetPercentageOfParticipants: 90,
            trackingMode: true,
            quizQuestions: [
              %{
                question: "First question?",
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
          startMinute: 50,
          eventData: %{
            durationTimeSec: 42,
            targetPercentageOfParticipants: 25,
            trackingMode: false,
            quizQuestions: %{
              question: "Updated question?",
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
