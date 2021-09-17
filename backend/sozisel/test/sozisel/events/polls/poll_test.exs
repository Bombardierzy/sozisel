defmodule Sozise.Events.Polls.PollTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Events
  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.Polls.{Poll, PollOption}

  @valid_attrs %{
    name: "some poll",
    duration_time_sec: 120,
    start_minute: 42,
    event_data: %{
      question: "Do you like being here?",
      is_multi_choice: false,
      options: [
        %{id: "1", text: "yes"},
        %{id: "2", text: "no"},
        %{id: "3", text: "stop asking stupid questions"}
      ]
    }
  }

  @update_attrs %{
    name: "some updated poll name",
    start_minute: 43,
    event_data: %{
      question: "Do you like being at all?",
      is_multi_choice: true,
      options: [
        %{id: "1", text: "yes"},
        %{id: "2", text: "no"},
        %{id: "3", text: "Please, more questions like that!"}
      ]
    }
  }

  @invalid_attrs %{
    name: "some poll",
    duration_time_sec: 120,
    start_minute: nil,
    event_data: nil
  }

  defp poll_fixture(template) do
    {:ok, poll} =
      @valid_attrs
      |> Map.put(:session_template_id, template.id)
      |> Events.create_event()

    poll
  end

  describe "poll events" do
    test "create_event/1 with valid poll data creates an event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{event_data: %Poll{options: options, is_multi_choice: false}}} =
               Events.create_event(valid_attrs)

      assert options == [
               %PollOption{id: "1", text: "yes"},
               %PollOption{id: "2", text: "no"},
               %PollOption{id: "3", text: "stop asking stupid questions"}
             ]
    end

    test "create_event/1 with invalid poll data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/1 with valid poll data updates the event" do
      template = insert(:template)
      event = poll_fixture(template)

      assert {:ok,
              %Event{
                event_data: %Poll{question: question, options: options, is_multi_choice: true}
              }} = Events.update_event(event, @update_attrs)

      assert question == "Do you like being at all?"

      assert options == [
               %PollOption{id: "1", text: "yes"},
               %PollOption{id: "2", text: "no"},
               %PollOption{id: "3", text: "Please, more questions like that!"}
             ]
    end

    test "update_event/2 with invalid data returns error changeset" do
      template = insert(:template)
      event = poll_fixture(template)

      assert {:error, %Ecto.Changeset{}} = Events.update_event(event, @invalid_attrs)

      assert event == Events.get_event!(event.id)
    end

    test "delete_event/1 deletes the event" do
      template = insert(:template)
      event = poll_fixture(template)

      assert {:ok, %Event{}} = Events.delete_event(event)
      assert_raise Ecto.NoResultsError, fn -> Events.get_event!(event.id) end
    end
  end
end
