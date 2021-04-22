defmodule Sozisel.EventsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Events
  alias Events.Event

  import Sozisel.Factory

  describe "events" do
    @valid_attrs %{
      name: "some name",
      start_minute: 42,
      event_type: %{
        duration_time_sec: 12,
        target_percentage_of_participants: 2,
        quiz_questions: [
          %{
            question: "What is the capital of Poland?",
            answers: ["Cracow", "Warsaw", "Podlasie"],
            correct_answers: ["Warsaw"]
          },
          %{
            question: "First question?",
            answers: ["Answer 1", "Answer 2"],
            correct_answers: ["Answer 1"]
          }
        ]
      }
    }
    @update_attrs %{
      name: "some updated name",
      start_minute: 43,
      event_type: %{
        duration_time_sec: 13,
        target_percentage_of_participants: 4,
        quiz_questions: [
          %{
            question: "What color is the banana?",
            answers: ["Red", "Black", "Yellow", "Green"],
            correct_answers: ["Yellow", "Green"]
          }
        ]
      }
    }
    @invalid_attrs %{
      event_type: nil,
      name: nil,
      start_minute: nil
    }

    def event_fixture(attrs \\ %{}) do
      {:ok, event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Events.create_event()

      event
    end

    test "list_events/0 returns all events" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert Events.list_events() == [event]
    end

    test "list_template_events/1 returns all template events" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert Events.list_template_events(template.id) == [event]
    end

    test "get_event!/1 returns the event with given id" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert Events.get_event!(event.id) == event
    end

    test "create_event/1 with valid data creates a event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{} = event} = Events.create_event(valid_attrs)

      assert Map.fetch(event.event_type, :target_percentage_of_participants) == {:ok, 2}

      assert event.event_type == %Sozisel.Model.Quizzes.Quiz{
               duration_time_sec: 12,
               target_percentage_of_participants: 2,
               quiz_questions: [
                 %Sozisel.Model.Quizzes.QuizQuestion{
                   question: "What is the capital of Poland?",
                   answers: ["Cracow", "Warsaw", "Podlasie"],
                   correct_answers: ["Warsaw"]
                 },
                 %Sozisel.Model.Quizzes.QuizQuestion{
                   question: "First question?",
                   answers: ["Answer 1", "Answer 2"],
                   correct_answers: ["Answer 1"]
                 }
               ]
             }

      assert event.name == "some name"
      assert event.start_minute == 42
    end

    test "create_event/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/2 with valid data updates the event" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert {:ok, %Event{} = event} = Events.update_event(event, @update_attrs)

      assert Map.fetch(event.event_type, :target_percentage_of_participants) == {:ok, 4}

      assert event.event_type == %Sozisel.Model.Quizzes.Quiz{
               duration_time_sec: 13,
               target_percentage_of_participants: 4,
               quiz_questions: [
                 %Sozisel.Model.Quizzes.QuizQuestion{
                   question: "What color is the banana?",
                   answers: ["Red", "Black", "Yellow", "Green"],
                   correct_answers: ["Yellow", "Green"]
                 }
               ]
             }

      assert event.name == "some updated name"
      assert event.start_minute == 43
    end

    test "update_event/2 with invalid data returns error changeset" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert {:error, %Ecto.Changeset{}} = Events.update_event(event, @invalid_attrs)
      assert event == Events.get_event!(event.id)
    end

    test "delete_event/1 deletes the event" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert {:ok, %Event{}} = Events.delete_event(event)
      assert_raise Ecto.NoResultsError, fn -> Events.get_event!(event.id) end
    end

    test "change_event/1 returns a event changeset" do
      template = insert(:template)
      event = event_fixture(%{session_template_id: template.id})
      assert %Ecto.Changeset{} = Events.change_event(event)
    end
  end
end
