defmodule Sozisel.EventResultsTest do
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
            question: "What is the capital of Poland?",
            all_answers: ["Cracow", "Warsaw", "Podlasie"],
            final_answers: ["Podlasie"],
            is_correct: false,
            track_nodes: [
              %{reaction_time: 3.32, answer: "Warsaw", selected: true},
              %{reaction_time: 5.41, answer: "Cracow", selected: true},
              %{reaction_time: 7.25, answer: "Podlasie", selected: true}
            ]
          }
        ]
      }
    }
    @update_attrs %{
      result_data: %{
        participant_answers: [
          %{
            question: "What is the capital of Poland?",
            all_answers: ["Cracow", "Warsaw", "Podlasie"],
            final_answers: ["Podlasie"],
            is_correct: false,
            track_nodes: [
              %{reaction_time: 3.32, answer: "Warsaw", selected: true},
              %{reaction_time: 5.41, answer: "Cracow", selected: true},
              %{reaction_time: 7.25, answer: "Podlasie", selected: true}
            ]
          },
          %{
            question: "What color is the banana?",
            all_answers: ["Red", "Black", "Yellow", "Green"],
            final_answers: ["Yellow", "Green"],
            is_correct: true,
            track_nodes: [
              %{reaction_time: 1.01, answer: "Yellow", selected: true},
              %{reaction_time: 3.11, answer: "Red", selected: true},
              %{reaction_time: 5.25, answer: "Red", selected: false},
              %{reaction_time: 6.61, answer: "Green", selected: true},
            ]
          }
        ]
      }
    }
    @invalid_attrs %{participant_token: nil, result_data: nil}
    @valid_attrs_for_event %{
      name: "some name",
      start_minute: 42,
      event_data: %{
        duration_time_sec: 12,
        target_percentage_of_participants: 2,
        tracking_mode: true,
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

    test "list_event_results/0 returns all event_results" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})

      assert EventResults.list_event_results() == [event_result]
    end

    test "get_event_result!/1 returns the event_result with given id" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})

      assert EventResults.get_event_result!(event_result.id) == event_result
    end

    test "create_event_result/1 with valid data creates a event_result" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)

      valid_attrs = 
      @valid_attrs
      |> Map.put(:event_id, event.id)
      |> Map.put(:participant_id, participant.id)

      assert {:ok, %EventResult{} = event_result} = EventResults.create_event_result(valid_attrs)

      assert event_result.result_data == %Sozisel.Model.Quizzes.QuizResult{
        participant_answers: [
          %Sozisel.Model.Quizzes.ParticipantAnswer{
            all_answers: ["Cracow", "Warsaw", "Podlasie"], 
            final_answers: ["Podlasie"], 
            is_correct: false, 
            question: "What is the capital of Poland?", 
            track_nodes: [
              %Sozisel.Model.Quizzes.TrackNode{answer: "Warsaw", reaction_time: 3.32, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Cracow", reaction_time: 5.41, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Podlasie", reaction_time: 7.25, selected: true}
            ]
          }
        ]
      }

      assert event_result.event_id == event.id
      assert event_result.participant_id == participant.id
    end

    test "create_event_result/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = EventResults.create_event_result(@invalid_attrs)
    end

    test "update_event_result/2 with valid data updates the event_result" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})

      assert {:ok, %EventResult{} = event_result} = EventResults.update_event_result(event_result, @update_attrs)
      
      assert event_result.result_data == %Sozisel.Model.Quizzes.QuizResult{
        participant_answers: [
          %Sozisel.Model.Quizzes.ParticipantAnswer{
            all_answers: ["Cracow", "Warsaw", "Podlasie"], 
            final_answers: ["Podlasie"], 
            is_correct: false, 
            question: "What is the capital of Poland?", 
            track_nodes: [
              %Sozisel.Model.Quizzes.TrackNode{answer: "Warsaw", reaction_time: 3.32, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Cracow", reaction_time: 5.41, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Podlasie", reaction_time: 7.25, selected: true}
            ]
          }, 
          %Sozisel.Model.Quizzes.ParticipantAnswer{
            all_answers: ["Red", "Black", "Yellow", "Green"], 
            final_answers: ["Yellow", "Green"],
            is_correct: true, 
            question: "What color is the banana?", 
            track_nodes: [
              %Sozisel.Model.Quizzes.TrackNode{answer: "Yellow", reaction_time: 1.01, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Red", reaction_time: 3.11, selected: true}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Red", reaction_time: 5.25, selected: false}, 
              %Sozisel.Model.Quizzes.TrackNode{answer: "Green", reaction_time: 6.61, selected: true}
            ]
          }
        ]
      }

      assert event_result.event_id == event.id
      assert event_result.participant_id == participant.id
    end

    test "update_event_result/2 with invalid data returns error changeset" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})

      assert {:error, %Ecto.Changeset{}} = EventResults.update_event_result(event_result, @invalid_attrs)
      assert event_result == EventResults.get_event_result!(event_result.id)
    end

    test "delete_event_result/1 deletes the event_result" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})

      assert {:ok, %EventResult{}} = EventResults.delete_event_result(event_result)
      assert_raise Ecto.NoResultsError, fn -> EventResults.get_event_result!(event_result.id) end
    end

    test "change_event_result/1 returns a event_result changeset" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      participant = insert(:participant)
      event_result = event_result_fixture(%{event_id: event.id, participant_id: participant.id})
      
      assert %Ecto.Changeset{} = EventResults.change_event_result(event_result)
    end
  end
end
