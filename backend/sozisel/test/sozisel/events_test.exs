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
        duration_time: 12,
        number_of_targets: 2,
        quiz_questions: [
          %{
            question: "What is the capital of Poland?",
            answers: ["Cracow", "Warsaw", "Podlasie"],
            correct_answers: [1]
          },
          %{
            question: "First question?",
            answers: ["Answer 1", "Answer 2"],
            correct_answers: [0]
          }
        ]
      }
    }
    @update_attrs %{
      name: "some updated name",
      start_minute: 43,
      event_type: %{
        duration_time: 13,
        number_of_targets: 4,
        quiz_questions: [
          %{
            question: "Jakiego koloru jest banan?",
            answers: ["Red", "Black", "Yellow", "Green"],
            correct_answers: [2, 3]
          }
        ]
      }
    }
    @invalid_attrs %{
      event_type: nil,
      name: nil,
      start_minute: nil
    }

    test "list_events/0 returns all events" do
      event = insert(:event)
      assert Events.list_events() == [event]
    end

    test "list_template_events/1 returns all template events" do
      template = insert(:template)
      event = insert(:event, %{session_template_id: template.id})
      assert Events.list_template_events(template.id) == [event]
    end

    test "get_event!/1 returns the event with given id" do
      event = insert(:event)
      assert Events.get_event!(event.id) == event
    end

    test "create_event/1 with valid data creates a event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{} = event} = Events.create_event(valid_attrs)

      assert Map.fetch(event.event_type, :number_of_targets) == {:ok, 2}

      assert event.event_type
             |> Map.fetch(:quiz_questions)
             |> elem(1)
             |> Enum.at(1)
             |> Map.fetch(:question) == {:ok, "First question?"}

      assert event.name == "some name"
      assert event.start_minute == 42
    end

    test "create_event/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/2 with valid data updates the event" do
      event = insert(:event)
      assert {:ok, %Event{} = event} = Events.update_event(event, @update_attrs)

      assert Map.fetch(event.event_type, :number_of_targets) == {:ok, 4}

      assert event.event_type
             |> Map.fetch(:quiz_questions)
             |> elem(1)
             |> Enum.at(0)
             |> Map.fetch(:answers) == {:ok, ["Red", "Black", "Yellow", "Green"]}

      assert event.name == "some updated name"
      assert event.start_minute == 43
    end

    test "update_event/2 with invalid data returns error changeset" do
      event = insert(:event)
      assert {:error, %Ecto.Changeset{}} = Events.update_event(event, @invalid_attrs)
      assert event == Events.get_event!(event.id)
    end

    test "delete_event/1 deletes the event" do
      event = insert(:event)
      assert {:ok, %Event{}} = Events.delete_event(event)
      assert_raise Ecto.NoResultsError, fn -> Events.get_event!(event.id) end
    end

    test "change_event/1 returns a event changeset" do
      event = insert(:event)
      assert %Ecto.Changeset{} = Events.change_event(event)
    end
  end
end
