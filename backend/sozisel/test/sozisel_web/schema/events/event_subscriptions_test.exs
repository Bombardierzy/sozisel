defmodule SoziselWeb.Schema.Events.EventSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  @launch_event_mutation """
  mutation LaunchEvent($eventId: ID!, $sessionId: ID!, $broadcast: Boolean, $targetParticipants: [ID]) {
    launchEvent(eventId: $eventId, sessionId: $sessionId, broadcast: $broadcast, targetParticipants: $targetParticipants) {
      id
    }
  }
  """

  @submit_quiz_results """
  mutation SubmitQuizResult($token: String!, $input: QuizResultInput!) {
    submitQuizResults(token: $token, input: $input) {
      id
    }
  }
  """

  @submit_poll_result """
  mutation SubmitPollResult($token: String!, $input: PollResultInput!) {
    submitPollResult(token: $token, input: $input) {
      id
    }
  }
  """

  @submit_whiteboard_result """
  mutation SubmitWhiteboardResult($token: String!, $input: WhiteboardResultInput!) {
    submitWhiteboardResult(token: $token, input: $input) {
      id
    }
  }
  """

  @participant_event_launched """
  subscription EventLaunched($participantToken: String!) {
    eventLaunched(participantToken: $participantToken) {
      eventData {
        __typename
        ... on Poll {
          question
          options {
            id
            text
          }
        }
        ... on ParticipantQuiz {
          quizQuestions {
            question
            answers {
              id
              text
            }
          }
        }
        ... on Whiteboard {
          task
        }
      }
    }
  }
  """

  @presenter_event_result_submitted """
  subscription EventResultSubmitted($sessionId: ID!) {
    eventResultSubmitted(sessionId: $sessionId) {
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
        __typename
        ... on PollResult {
          optionIds
        }
        ... on QuizSimpleResult {
          totalPoints
        }
        ... on WhiteboardResult {
          path
          text
          used_time
        }
      }
    }
  }
  """

  @live_poll_summary """
  subscription LivePollSummary($participantToken: String!, $launchedEventId: String!) {
    livePollSummary(participantToken: $participantToken, launchedEventId: $launchedEventId) {
      id
      question
      optionSummaries {
        id
        text
        votes
      }
      totalVoters
    }
  }
  """

  def mock_participant_event(session_template, type) do
    case type do
      :quiz -> insert(:quiz_event, session_template_id: session_template.id)
      :poll -> insert(:poll_event, session_template_id: session_template.id)
      :whiteboard -> insert(:whiteboard_event, session_template_id: session_template.id)
    end
  end

  describe "Event subscriptions should" do
    setup do
      user = insert(:user)
      user_socket = test_socket(user)
      user_conn = test_conn(user)

      session_template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: session_template.id, user_id: user.id)

      participant = insert(:participant, session_id: session.id)

      [
        session: session,
        session_template: session_template,
        participant: participant,
        user: user,
        user_socket: user_socket,
        user_conn: user_conn,
        conn: test_conn()
      ]
    end

    test "broadcast event launched event to a proper participant", ctx do
      variables = %{
        participantToken: ctx.participant.token
      }

      socket = test_socket()

      sub = run_subscription(socket, @participant_event_launched, variables)

      quiz = mock_participant_event(ctx.session_template, :quiz)

      assert %{data: %{"launchEvent" => %{"id" => _launched_event_id}}} =
               run_query(ctx.user_conn, @launch_event_mutation, %{
                 sessionId: ctx.session.id,
                 eventId: quiz.id,
                 broadcast: true
               })

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(sub)

      Repo.delete_all(LaunchedEvent)

      # broadcast to a single participant
      assert %{data: %{"launchEvent" => %{"id" => _launched_event_id}}} =
               run_query(ctx.user_conn, @launch_event_mutation, %{
                 sessionId: ctx.session.id,
                 eventId: quiz.id,
                 broadcast: false,
                 targetParticipants: [ctx.participant.id]
               })

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(sub)
    end

    test "broadcast quiz event result submitted event back to presenter", ctx do
      event = insert(:quiz_event, session_template_id: ctx.session_template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: ctx.session.id)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(ctx.user_socket, @presenter_event_result_submitted, variables)

      assert %{data: %{}} =
               run_query(test_conn(), @submit_quiz_results, %{
                 token: ctx.participant.token,
                 input: %{
                   launched_event_id: launched_event.id,
                   participant_answers: [
                     %{
                       question_id: "1",
                       final_answer_ids: ["1"],
                       answer_time: 2.41,
                       track_nodes: []
                     }
                   ]
                 }
               })

      participant_id = ctx.participant.id
      event_id = event.id

      assert %{
               data: %{
                 "eventResultSubmitted" => %{
                   "resultData" => %{
                     "__typename" => "QuizSimpleResult",
                     "totalPoints" => _total_points
                   },
                   "participant" => %{
                     "id" => ^participant_id
                   },
                   "launchedEvent" => %{
                     "event" => %{
                       "id" => ^event_id
                     }
                   }
                 }
               }
             } = receive_subscription(sub)
    end

    test "broadcast poll event result back to presenter", ctx do
      event = insert(:poll_event, session_template_id: ctx.session_template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: ctx.session.id)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(ctx.user_socket, @presenter_event_result_submitted, variables)

      assert %{data: %{}} =
               run_query(test_conn(), @submit_poll_result, %{
                 token: ctx.participant.token,
                 input: %{
                   launched_event_id: launched_event.id,
                   poll_option_ids: ["1"]
                 }
               })

      assert %{
               data: %{
                 "eventResultSubmitted" => %{
                   "resultData" => %{
                     "__typename" => "PollResult",
                     "optionIds" => ["1"]
                   }
                 }
               }
             } = receive_subscription(sub)
    end

    test "broadcast whiteboard event result back to presenter", ctx do
      event = insert(:whiteboard_event, session_template_id: ctx.session_template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: ctx.session.id)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(ctx.user_socket, @presenter_event_result_submitted, variables)

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
        token: ctx.participant.token
      }

      assert %{"data" => %{"submitWhiteboardResult" => %{"id" => id}}} =
               ctx.conn
               |> post("/api/graphql/",
                 query: @submit_whiteboard_result,
                 variables: variables,
                 image: upload
               )
               |> json_response(200)

      assert %{
               data: %{
                 "eventResultSubmitted" => %{
                   "id" => ^id,
                   "resultData" => %{
                     "__typename" => "WhiteboardResult",
                     "path" => _,
                     "text" => "some text",
                     "used_time" => 145.0
                   }
                 }
               }
             } = receive_subscription(sub)
    end

    test "broadcast poll summary to participants on submit poll mutation", ctx do
      template = insert(:template)
      poll = insert(:poll_event, session_template_id: template.id)

      participant = insert(:participant, session_id: ctx.session.id)

      launched_event = insert(:launched_event, session_id: ctx.session.id, event_id: poll.id)

      sub =
        run_subscription(test_socket(), @live_poll_summary, %{
          participantToken: participant.token,
          launchedEventId: launched_event.id
        })

      submit_poll = """
      mutation Submit($token: String!, $input: PollResultInput!) {
        submitPollResult(token: $token, input: $input) {
          id
          resultData {
            ... on PollResult {
              optionIds
            }
          }

        }
      }
      """

      assert %{data: _result} =
               run_query(test_conn(), submit_poll, %{
                 token: participant.token,
                 input: %{launched_event_id: launched_event.id, poll_option_ids: ["1"]}
               })

      assert %{
               data: %{
                 "livePollSummary" => %{
                   "id" => _,
                   "totalVoters" => 1,
                   "optionSummaries" => [
                     %{
                       "id" => "1",
                       "votes" => 1
                     },
                     %{
                       "id" => "2",
                       "votes" => 0
                     }
                   ]
                 }
               }
             } = receive_subscription(sub)
    end

    test "return an error when a presenter is not a session owner", ctx do
      random_user = insert(:user)
      socket = test_socket(random_user)

      variables = %{
        sessionId: ctx.session.id
      }

      assert %{errors: [%{message: "unauthorized"}]} =
               run_subscription(socket, @presenter_event_result_submitted, variables)
    end
  end

  describe "Launching all events" do
    setup do
      user = insert(:user)
      user_conn = test_conn(user)

      session_template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: session_template.id, user_id: user.id)
      participant = insert(:participant, session_id: session.id)

      variables = %{
        participantToken: participant.token
      }

      sub = run_subscription(test_socket(), @participant_event_launched, variables)

      [
        session: session,
        session_template: session_template,
        participant: participant,
        user: user,
        user_conn: user_conn,
        subscription: sub
      ]
    end

    test "quiz", ctx do
      quiz = mock_participant_event(ctx.session_template, :quiz)

      assert %{data: %{}} =
               run_query(ctx.user_conn, @launch_event_mutation, %{
                 sessionId: ctx.session.id,
                 eventId: quiz.id,
                 broadcast: true
               })

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "__typename" => "ParticipantQuiz",
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(ctx.subscription)
    end

    test "poll", ctx do
      poll = mock_participant_event(ctx.session_template, :poll)

      assert %{data: %{}} =
               run_query(ctx.user_conn, @launch_event_mutation, %{
                 sessionId: ctx.session.id,
                 eventId: poll.id,
                 broadcast: true
               })

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "__typename" => "Poll",
                     "question" => _,
                     "options" => _
                   }
                 }
               }
             } = receive_subscription(ctx.subscription)
    end

    test "whiteboard", ctx do
      whiteboard = mock_participant_event(ctx.session_template, :whiteboard)

      assert %{data: %{}} =
               run_query(ctx.user_conn, @launch_event_mutation, %{
                 sessionId: ctx.session.id,
                 eventId: whiteboard.id,
                 broadcast: true
               })

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "__typename" => "Whiteboard",
                     "task" => "Draw a fortuna export"
                   }
                 }
               }
             } = receive_subscription(ctx.subscription)
    end
  end
end
