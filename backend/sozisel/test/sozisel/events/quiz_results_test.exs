defmodule Sozisel.Events.QuizResultsTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Events
  alias Sozisel.Model.EventResults
  alias EventResults.EventResult

  describe "event_results" do
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
        ],
        quiz_answer_time: 23.12
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
        ],
        quiz_answer_time: 52.64
      }
    }
    @invalid_attrs %{participant_token: nil, result_data: nil}
    @valid_attrs_for_event %{
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
          },
          %{
            question: "What color is the banana?",
            id: "2",
            answers: [
              %{text: "Red", id: "1"},
              %{text: "Black", id: "2"},
              %{text: "Yellow", id: "3"},
              %{text: "Green", id: "4"}
            ],
            correct_answers: [
              %{text: "Yellow", id: "3"},
              %{text: "Green", id: "4"}
            ]
          }
        ]
      }
    }

    def event_fixture(attrs \\ %{}) do
      {:ok, event} =
        attrs
        |> Enum.into(@valid_attrs_for_event)
        |> Events.create_event()

      event
    end

    def event_result_fixture(attrs \\ %{}) do
      {:ok, event_result} =
        attrs
        |> Enum.into(@valid_attrs)
        |> EventResults.create_event_result()

      event_result
    end

    def prepare_fixtures() do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})

      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)
      participant = insert(:participant)

      event_result =
        event_result_fixture(%{
          launched_event_id: launched_event.id,
          participant_id: participant.id
        })

      %{
        event_result: event_result,
        template: template,
        event: event,
        session: session,
        launched_event: launched_event,
        participant: participant
      }
    end

    test "list_event_results/0 returns all event_results" do
      %{event_result: event_result} = prepare_fixtures()

      assert EventResults.list_event_results() == [event_result]
    end

    test "get_event_result!/1 returns the event_result with given id" do
      %{event_result: event_result} = prepare_fixtures()

      assert EventResults.get_event_result!(event_result.id) == event_result
    end

    test "create_event_result/1 with valid data creates a event_result" do
      %{event_result: event_result, launched_event: launched_event, participant: participant} =
        prepare_fixtures()

      # just delete it as it is created in fixtures
      Repo.delete(event_result)

      valid_attrs =
        @valid_attrs
        |> Map.put(:launched_event_id, launched_event.id)
        |> Map.put(:participant_id, participant.id)

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
               ],
               quiz_answer_time: 23.12
             }

      assert event_result.launched_event_id == launched_event.id
      assert event_result.participant_id == participant.id
    end

    test "create_event_result/1 with invalid data returns error changeset or unmatched event result error" do
      %{launched_event: launched_event} = prepare_fixtures()
      participant = insert(:participant)

      assert {:error, :unmatched_event_result} =
               EventResults.create_event_result(%{
                 launched_event_id: launched_event.id,
                 participant_id: participant.id,
                 event_data: %{}
               })
    end

    test "update_event_result/2 with valid data updates the event_result" do
      %{event_result: event_result, launched_event: launched_event, participant: participant} =
        prepare_fixtures()

      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(event_result, @update_attrs)

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
               ],
               quiz_answer_time: 52.64
             }

      assert event_result.launched_event_id == launched_event.id
      assert event_result.participant_id == participant.id
    end

    test "update_event_result/2 with invalid data returns error changeset" do
      %{event_result: event_result} = prepare_fixtures()

      assert {:error, %Ecto.Changeset{}} =
               EventResults.update_event_result(event_result, @invalid_attrs)

      assert event_result == EventResults.get_event_result!(event_result.id)
    end

    test "delete_event_result/1 deletes the event_result" do
      %{event_result: event_result} = prepare_fixtures()

      assert {:ok, %EventResult{}} = EventResults.delete_event_result(event_result)
      assert_raise Ecto.NoResultsError, fn -> EventResults.get_event_result!(event_result.id) end
    end

    test "change_event_result/1 returns a event_result changeset" do
      %{event_result: event_result} = prepare_fixtures()

      assert %Ecto.Changeset{} = EventResults.change_event_result(event_result)
    end
  end
end
