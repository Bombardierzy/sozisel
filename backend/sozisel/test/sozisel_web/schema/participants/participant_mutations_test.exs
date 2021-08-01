defmodule SoziselWeb.Schema.ParticipantMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Sessions

  @create_participant """
  mutation JoinSession($input: JoinSessionInput!) {
    joinSession(input: $input) {
      token
    }
  }
  """

  @finish_quiz """
  mutation SubmitQuizResults($input: QuizResultInput!, $token: String!) {
    submitQuizResults(input: $input, token: $token) {
      id
      participant {
        id
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
            points
            track_nodes {
              reaction_time
              answer_id
              selected
            }
          }
        }
      }
    }
  }
  """

  describe "Participant mutations should" do
    setup do
      [conn: test_conn()]
    end

    test "create a new participant to session with out password", ctx do
      session = insert(:session)

      Sessions.update_session(session, %{entry_password: nil})
      Sessions.update_session(session, %{start_time: DateTime.utc_now()})

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name"
        }
      }

      assert %{
               data: %{
                 "joinSession" => %{
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "create a new participant to session with password", ctx do
      session = insert(:session, entry_password: "password123@")
      Sessions.update_session(session, %{start_time: DateTime.utc_now()})

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "password123@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => %{
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when wrong password", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "some_password@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when password set but user do not pass it", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when session has not been started", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "password123@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [
                 %{
                   "message" =>
                     "failed to create a participant because session has not been started"
                 }
               ]
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when session has been ended", ctx do
      session = insert(:session, entry_password: "password123@")

      Sessions.update_session(session, %{
        start_time: DateTime.utc_now(),
        end_time: DateTime.add(DateTime.utc_now(), 3600, :second)
      })

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "password123@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [
                 %{"message" => "failed to create a participant because session has been ended"}
               ]
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "finish quiz, check answers and subscribe result to presenter", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)
      participant = insert(:participant, session_id: session.id)

      participant_id = participant.id
      event_id = event.id

      variables = %{
        input: %{
          launched_event_id: launched_event.id,
          participant_answers: [
            %{
              question_id: "1",
              final_answer_ids: ["3", "2"],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "3", selected: true},
                %{reaction_time: 2.53, answer_id: "3", selected: false},
                %{reaction_time: 3.32, answer_id: "3", selected: true},
                %{reaction_time: 4.11, answer_id: "2", selected: true}
              ]
            },
            %{
              question_id: "2",
              final_answer_ids: ["2"],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "1", selected: true},
                %{reaction_time: 2.01, answer_id: "1", selected: false},
                %{reaction_time: 4.25, answer_id: "3", selected: true}
              ]
            }
          ]
        },
        token: participant.token
      }

      assert %{
               data: %{
                 "submitQuizResults" => %{
                   "id" => _,
                   "participant" => %{
                     "id" => ^participant_id
                   },
                   "launchedEvent" => %{
                     "event" => %{
                       "id" => ^event_id
                     }
                   },
                   "resultData" => %{
                     "participantAnswers" => [
                       %{
                         "finalAnswerIds" => ["3", "2"],
                         "points" => 0,
                         "questionId" => "1",
                         "track_nodes" => [
                           %{"answer_id" => "3", "reaction_time" => 1.23, "selected" => true},
                           %{"answer_id" => "3", "reaction_time" => 2.53, "selected" => false},
                           %{"answer_id" => "3", "reaction_time" => 3.32, "selected" => true},
                           %{"answer_id" => "2", "reaction_time" => 4.11, "selected" => true}
                         ]
                       },
                       %{
                         "finalAnswerIds" => ["2"],
                         "questionId" => "2",
                         "points" => 1,
                         "track_nodes" => [
                           %{"answer_id" => "1", "reaction_time" => 1.23, "selected" => true},
                           %{"answer_id" => "1", "reaction_time" => 2.01, "selected" => false},
                           %{"answer_id" => "3", "reaction_time" => 4.25, "selected" => true}
                         ]
                       }
                     ]
                   }
                 }
               }
             } = run_query(ctx.conn, @finish_quiz, variables)
    end

    test "finish quiz without select answers, check and subscribe result to presenter", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)
      participant = insert(:participant, session_id: session.id)

      participant_id = participant.id
      event_id = event.id

      variables = %{
        input: %{
          launched_event_id: launched_event.id,
          participant_answers: [
            %{
              question_id: "1",
              final_answer_ids: [],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "3", selected: true},
                %{reaction_time: 2.53, answer_id: "3", selected: false}
              ]
            },
            %{
              question_id: "2",
              final_answer_ids: ["2"],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "1", selected: true},
                %{reaction_time: 2.01, answer_id: "1", selected: false},
                %{reaction_time: 4.25, answer_id: "3", selected: true}
              ]
            }
          ]
        },
        token: participant.token
      }

      assert %{
               data: %{
                 "submitQuizResults" => %{
                   "id" => _,
                   "participant" => %{
                     "id" => ^participant_id
                   },
                   "launchedEvent" => %{
                     "event" => %{
                       "id" => ^event_id
                     }
                   },
                   "resultData" => %{
                     "participantAnswers" => [
                       %{
                         "finalAnswerIds" => [],
                         "points" => 0,
                         "questionId" => "1",
                         "track_nodes" => [
                           %{"answer_id" => "3", "reaction_time" => 1.23, "selected" => true},
                           %{"answer_id" => "3", "reaction_time" => 2.53, "selected" => false}
                         ]
                       },
                       %{
                         "finalAnswerIds" => ["2"],
                         "questionId" => "2",
                         "points" => 1,
                         "track_nodes" => [
                           %{"answer_id" => "1", "reaction_time" => 1.23, "selected" => true},
                           %{"answer_id" => "1", "reaction_time" => 2.01, "selected" => false},
                           %{"answer_id" => "3", "reaction_time" => 4.25, "selected" => true}
                         ]
                       }
                     ]
                   }
                 }
               }
             } = run_query(ctx.conn, @finish_quiz, variables)
    end

    test "forbid check quiz eith wrong launched_event_id", ctx do
      participant = insert(:participant)

      variables = %{
        input: %{
          launched_event_id: Ecto.UUID.generate(),
          participant_answers: [
            %{
              question_id: "1",
              final_answer_ids: [],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "3", selected: true},
                %{reaction_time: 2.53, answer_id: "3", selected: false}
              ]
            },
            %{
              question_id: "2",
              final_answer_ids: ["3"],
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "1", selected: true},
                %{reaction_time: 2.01, answer_id: "1", selected: false},
                %{reaction_time: 4.25, answer_id: "3", selected: true}
              ]
            }
          ]
        },
        token: participant.token
      }

      assert %{
               data: %{
                 "submitQuizResults" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(ctx.conn, @finish_quiz, variables)
    end
  end
end
