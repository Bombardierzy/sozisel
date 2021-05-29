defmodule SoziselWeb.Schema.Events.EventSubscriptionsTest do
  use SoziselWeb.AbsintheCase

  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias Sozisel.Model.Quizzes.{QuizResult, ParticipantAnswer}
  alias Sozisel.Model.EventResults.EventResult

  import Sozisel.Factory

  @participant_event_launched """
  subscription EventLaunched($participantToken: String!) {
    eventLaunched(participantToken: $participantToken) {
      eventData {
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

  def mock_participant_event(session \\ nil) do
    if is_nil(session) do
      build(:event)
    else
      build(:event, session_id: session.id)
    end
  end

  def mock_event_result(session, event, participant) do
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

      # broadcast to a whole session
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_events(ctx.session.id),
        mock_participant_event()
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
        Topics.session_participant_events(ctx.session.id, ctx.participant.id),
        mock_participant_event()
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

    test "broadcast event result submitted event back to presenter", ctx do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)

      socket = test_socket(ctx.user)

      variables = %{
        sessionId: ctx.session.id
      }

      sub = run_subscription(socket, @presenter_event_result_submitted, variables)

      Helpers.subscription_publish(
        :event_result_submitted,
        Topics.session_presenter(ctx.session.id, ctx.user.id),
        mock_event_result(ctx.session, event, ctx.participant)
      )

      participant_id = ctx.participant.id
      event_id = event.id

      assert %{
               data: %{
                 "eventResultSubmitted" => %{
                   "resultData" => %{
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
end
