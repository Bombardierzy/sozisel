defmodule Sozisel.Events.Quizzes.QuizResultsTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias EventResults.EventResult

  describe "quiz results" do
    @valid_attrs %{
      result_data: %{
        participant_answers: [
          %{
            question_id: "1",
            final_answer_ids: ["3"],
            answer_time: 9.42,
            points: 0,
            track_nodes: [
              %{reaction_time: 3.32, answer_id: "2", selected: true},
              %{reaction_time: 5.41, answer_id: "1", selected: true},
              %{reaction_time: 7.25, answer_id: "3", selected: true}
            ]
          }
        ]
      }
    }
    @update_attrs %{
      result_data: %{
        participant_answers: [
          %{
            question_id: "1",
            final_answer_ids: ["3"],
            answer_time: 10.53,
            points: 0,
            track_nodes: [
              %{reaction_time: 3.32, answer_id: "2", selected: true},
              %{reaction_time: 5.41, answer_id: "1", selected: true},
              %{reaction_time: 7.25, answer_id: "3", selected: true}
            ]
          },
          %{
            question_id: "2",
            final_answer_ids: ["3", "4"],
            answer_time: 4.23,
            points: 0,
            track_nodes: [
              %{reaction_time: 1.01, answer_id: "3", selected: true},
              %{reaction_time: 3.11, answer_id: "1", selected: true},
              %{reaction_time: 5.25, answer_id: "1", selected: false},
              %{reaction_time: 6.61, answer_id: "4", selected: true}
            ]
          }
        ]
      }
    }

    setup do
      template = insert(:template)
      event = insert(:quiz_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant = insert(:participant, session_id: session.id)

      event_result =
        insert(:event_result,
          launched_event: launched_event,
          participant: participant,
          result_data: random_event_result(event.event_data)
        )

      [event_result: event_result, launched_event: launched_event, participant: participant]
    end

    test "create_event_result/1 with valid quiz data creates a event_result", ctx do
      # just delete it as it is created in fixture
      Repo.delete(ctx.event_result)

      valid_attrs =
        @valid_attrs
        |> Map.put(:launched_event_id, ctx.launched_event.id)
        |> Map.put(:participant_id, ctx.participant.id)

      assert {:ok, %EventResult{} = event_result} = EventResults.create_event_result(valid_attrs)

      assert event_result.result_data == %Sozisel.Model.Quizzes.QuizResult{
               participant_answers: [
                 %Sozisel.Model.Quizzes.ParticipantAnswer{
                   final_answer_ids: ["3"],
                   answer_time: 9.42,
                   points: 0,
                   question_id: "1",
                   track_nodes: [
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "2",
                       reaction_time: 3.32,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "1",
                       reaction_time: 5.41,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "3",
                       reaction_time: 7.25,
                       selected: true
                     }
                   ]
                 }
               ]
             }

      assert ctx.event_result.launched_event_id == ctx.launched_event.id
      assert ctx.event_result.participant_id == ctx.participant.id
    end

    test "update_event_result/2 with valid quiz data updates the event_result", ctx do
      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(ctx.event_result, @update_attrs)

      assert event_result.result_data == %Sozisel.Model.Quizzes.QuizResult{
               participant_answers: [
                 %Sozisel.Model.Quizzes.ParticipantAnswer{
                   final_answer_ids: ["3"],
                   answer_time: 10.53,
                   points: 0,
                   question_id: "1",
                   track_nodes: [
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "2",
                       reaction_time: 3.32,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "1",
                       reaction_time: 5.41,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "3",
                       reaction_time: 7.25,
                       selected: true
                     }
                   ]
                 },
                 %Sozisel.Model.Quizzes.ParticipantAnswer{
                   final_answer_ids: ["3", "4"],
                   answer_time: 4.23,
                   points: 0,
                   question_id: "2",
                   track_nodes: [
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "3",
                       reaction_time: 1.01,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "1",
                       reaction_time: 3.11,
                       selected: true
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "1",
                       reaction_time: 5.25,
                       selected: false
                     },
                     %Sozisel.Model.Quizzes.TrackNode{
                       answer_id: "4",
                       reaction_time: 6.61,
                       selected: true
                     }
                   ]
                 }
               ]
             }

      assert event_result.launched_event_id == ctx.launched_event.id
      assert event_result.participant_id == ctx.participant.id
    end
  end
end
