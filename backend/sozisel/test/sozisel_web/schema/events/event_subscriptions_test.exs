defmodule SoziselWeb.Schema.Events.EventSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias Sozisel.Model.Quizzes.{QuizResult, ParticipantAnswer}
  alias Sozisel.Model.Polls.PollResult
  alias Sozisel.Model.EventResults.EventResult

  import Sozisel.Factory

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
      }
    }
  }
  """

  @presenter_event_result_submitted """
  subscription EventResultSubmitted($sessionId: ID!) {
    eventResultSubmitted(sessionId: $sessionId) {
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

  def mock_participant_event(session \\ nil, type) do
    attrs =
      if session == nil do
        %{}
      else
        %{session_id: session.id}
      end

    case type do
      :poll -> build(:poll_event, attrs)
      :quiz -> build(:quiz_event, attrs)
    end
  end

  def mock_quiz_event_result(session, event, participant) do
    launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)

    %EventResult{
      id: Ecto.UUID.generate(),
      participant_id: participant.id,
      launched_event_id: launched_event.id,
      result_data: %QuizResult{
        participant_answers: [
          %ParticipantAnswer{
            question_id: "some id",
            final_answer_ids: ["some answer id"],
            is_correct: false,
            track_nodes: []
          }
        ]
      }
    }
    |> Repo.insert()
    |> elem(1)
  end

  def mock_poll_event_result(session, event, participant) do
    launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)

    %EventResult{
      id: Ecto.UUID.generate(),
      participant_id: participant.id,
      launched_event_id: launched_event.id,
      result_data: %PollResult{
        option_ids: ["1"]
      }
    }
    |> Repo.insert()
    |> elem(1)
  end

  describe "Event subscriptions should" do
    setup do
      user = insert(:user)
      session = insert(:session, user_id: user.id)
      participant = insert(:participant, session_id: session.id)

      [session: session, participant: participant, user: user]
    end

    test "broadcast event launched event to a proper participant", ctx do
      variables = %{
        participantToken: ctx.participant.token
      }

      socket = test_socket()

      sub = run_subscription(socket, @participant_event_launched, variables)

      # broadcast to all participants in session
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_all_participants(ctx.session.id),
        mock_participant_event(:quiz)
      )

      assert %{
               data: %{
                 "eventLaunched" => %{
                   "eventData" => %{
                     "quizQuestions" => _
                   }
                 }
               }
             } = receive_subscription(sub)

      # broadcast to a single participant
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_participant(ctx.session.id, ctx.participant.id),
        mock_participant_event(:quiz)
      )

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
      template = insert(:template)
      event = insert(:quiz_event, session_template_id: template.id)

      socket = test_socket(ctx.user)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(socket, @presenter_event_result_submitted, variables)

      Helpers.subscription_publish(
        :event_result_submitted,
        Topics.session_presenter(ctx.session.id, ctx.user.id),
        mock_quiz_event_result(ctx.session, event, ctx.participant)
      )

      participant_id = ctx.participant.id
      event_id = event.id

      assert %{
               data: %{
                 "eventResultSubmitted" => %{
                   "resultData" => %{
                     "__typename" => "QuizResult",
                     "participantAnswers" => [_answer]
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
      template = insert(:template)
      event = insert(:poll_event, session_template_id: template.id)

      socket = test_socket(ctx.user)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(socket, @presenter_event_result_submitted, variables)

      Helpers.subscription_publish(
        :event_result_submitted,
        Topics.session_presenter(ctx.session.id, ctx.user.id),
        mock_poll_event_result(ctx.session, event, ctx.participant)
      )

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
      session = insert(:session, user_id: user.id)
      participant = insert(:participant, session_id: session.id)

      variables = %{
        participantToken: participant.token
      }

      sub = run_subscription(test_socket(), @participant_event_launched, variables)

      [session: session, participant: participant, user: user, subscription: sub]
    end

    test "quiz", ctx do
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_all_participants(ctx.session.id),
        mock_participant_event(:quiz)
      )

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
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_all_participants(ctx.session.id),
        mock_participant_event(:poll)
      )

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
  end
end
