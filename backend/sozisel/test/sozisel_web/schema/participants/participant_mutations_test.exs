defmodule SoziselWeb.Schema.Participants.ParticipantMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Sessions
  alias Sozisel.MediaStorage.Disk
  alias Sozisel.Model.Whiteboards.WhiteboardResult

  @create_participant """
  mutation JoinSession($input: JoinSessionInput!) {
    joinSession(input: $input) {
      token
    }
  }
  """

  @submit_quiz_result_mutation """
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
            answer_time
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

  @submit_poll_result_mutation """
  mutation SubmitPollResult($input: PollResultInput!, $token: String!) {
    submitPollResult(input: $input, token: $token) {
      id
      resultData {
        ... on PollResult {
          optionIds
        }
      }
    }
  }
  """

  @submit_whiteboard_result_mutation """
  mutation SubmitWhiteboardResult($input: WhiteboardResultInput!, $token: String!) {
    submitWhiteboardResult(input: $input, token: $token) {
      id
      resultData {
        ... on WhiteboardResult {
          text
          used_time
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
      event = insert(:quiz_event, session_template_id: template.id)
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
              answer_time: 5.23,
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
              answer_time: 6.35,
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
                         "answer_time" => 5.23,
                         "points" => 0.0,
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
                         "answer_time" => 6.35,
                         "points" => 1.0,
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
             } = run_query(ctx.conn, @submit_quiz_result_mutation, variables)
    end

    test "finish quiz without select answers, check and subscribe result to presenter", ctx do
      template = insert(:template)
      event = insert(:quiz_event, session_template_id: template.id)
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
              answer_time: 3.63,
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "3", selected: true},
                %{reaction_time: 2.53, answer_id: "3", selected: false}
              ]
            },
            %{
              question_id: "2",
              final_answer_ids: ["2"],
              answer_time: 7.85,
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
                         "answer_time" => 3.63,
                         "points" => 0.0,
                         "questionId" => "1",
                         "track_nodes" => [
                           %{"answer_id" => "3", "reaction_time" => 1.23, "selected" => true},
                           %{"answer_id" => "3", "reaction_time" => 2.53, "selected" => false}
                         ]
                       },
                       %{
                         "finalAnswerIds" => ["2"],
                         "answer_time" => 7.85,
                         "questionId" => "2",
                         "points" => 1.0,
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
             } = run_query(ctx.conn, @submit_quiz_result_mutation, variables)
    end

    test "forbid check quiz with wrong launched_event_id", ctx do
      participant = insert(:participant)

      variables = %{
        input: %{
          launched_event_id: Ecto.UUID.generate(),
          participant_answers: [
            %{
              question_id: "1",
              final_answer_ids: [],
              answer_time: 4.34,
              track_nodes: [
                %{reaction_time: 1.23, answer_id: "3", selected: true},
                %{reaction_time: 2.53, answer_id: "3", selected: false}
              ]
            },
            %{
              question_id: "2",
              final_answer_ids: ["3"],
              answer_time: 6.35,
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
             } = run_query(ctx.conn, @submit_quiz_result_mutation, variables)
    end

    test "submit poll result", ctx do
      template = insert(:template)
      event = insert(:poll_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)
      participant = insert(:participant, session_id: session.id)

      variables = %{
        input: %{
          launched_event_id: launched_event.id,
          poll_option_ids: ["1"]
        },
        token: participant.token
      }

      assert %{
               data: %{
                 "submitPollResult" => %{
                   "id" => _,
                   "resultData" => %{
                     "optionIds" => ["1"]
                   }
                 }
               }
             } = run_query(ctx.conn, @submit_poll_result_mutation, variables)
    end

    test "submit whiteboard result", ctx do
      template = insert(:template)
      event = insert(:whiteboard_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)
      participant = insert(:participant, session_id: session.id)
      extension = ".png"

      File.copy!("test/assets/test_image.png", "/tmp/test_image.png")

      upload = %Plug.Upload{
        content_type: "image/png",
        path: "/tmp/test_image.png",
        filename: "whiteboard_image.png"
      }

      variables = %{
        input: %{
          launched_event_id: launched_event.id,
          image: "image",
          text: "some text",
          used_time: 145
        },
        token: participant.token
      }

      assert %{
               "data" => %{
                 "submitWhiteboardResult" => %{
                   "id" => _,
                   "resultData" => %{
                     "used_time" => 145.0,
                     "text" => "some text"
                   }
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @submit_whiteboard_result_mutation,
                 variables: variables,
                 image: upload
               )
               |> json_response(200)

      assert WhiteboardResult.generate_filename(launched_event.id, participant.id, extension)
             |> Disk.file_exists?()
    end

    test "forbid whiteboard event submit for invalid launched_event_id", ctx do
      participant = insert(:participant)

      File.copy!("test/assets/test_image.png", "/tmp/test_image.png")

      upload = %Plug.Upload{
        content_type: "image/png",
        path: "/tmp/test_image.png",
        filename: "whiteboard_image.png"
      }

      variables = %{
        input: %{
          launched_event_id: Ecto.UUID.generate(),
          image: "image",
          text: "some text",
          used_time: 145
        },
        token: participant.token
      }

      assert %{
               "data" => %{
                 "submitWhiteboardResult" => nil
               },
               "errors" => [%{"message" => "unauthorized"}]
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @submit_whiteboard_result_mutation,
                 variables: variables,
                 image: upload
               )
               |> json_response(200)
    end
  end
end
