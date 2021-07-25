defmodule Sozise.Events.PollTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Events
  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.EventResults
  alias Sozisel.Model.EventResults.EventResult
  alias Sozisel.Model.Polls.{Poll, Poll.PollOption, PollResult}

  @valid_attrs %{
    name: "some poll",
    start_minute: 42,
    event_data: %{
      question: "Do you like being here?",
      options: [
        %{option_id: "1", text: "yes"},
        %{option_id: "2", text: "no"},
        %{option_id: "3", text: "stop asking stupid questions"}
      ]
    }
  }

  @update_attrs %{
    name: "some updated poll name",
    start_minute: 43,
    event_data: %{
      question: "Do you like being at all?",
      options: [
        %{option_id: "1", text: "yes"},
        %{option_id: "2", text: "no"},
        %{option_id: "3", text: "Please, more questions like that!"}
      ]
    }
  }

  defp poll_fixture(template) do
    {:ok, event} =
      @valid_attrs
      |> Map.put(:session_template_id, template.id)
      |> Events.create_event()

    event
  end

  describe "poll events" do
    test "create_event/1 with valid poll data creates an event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{event_data: %Poll{options: options}}} = Events.create_event(valid_attrs)

      assert options == [
               %PollOption{option_id: "1", text: "yes"},
               %PollOption{option_id: "2", text: "no"},
               %PollOption{option_id: "3", text: "stop asking stupid questions"}
             ]
    end

    test "update_event/1 with valid poll data updates the event" do
      template = insert(:template)
      event = poll_fixture(template)

      assert {:ok, %Event{event_data: %Poll{question: question, options: options}}} =
               Events.update_event(event, @update_attrs)

      assert question == "Do you like being at all?"

      assert options == [
               %PollOption{option_id: "1", text: "yes"},
               %PollOption{option_id: "2", text: "no"},
               %PollOption{option_id: "3", text: "Please, more questions like that!"}
             ]
    end

    test "creating event result with valid data should success" do
      template = insert(:template)
      session = insert(:session, session_template_id: template.id)
      participant = insert(:participant, session_id: session.id)

      event = poll_fixture(template)
      launched_event = insert(:launched_event, event_id: event.id, session_id: session.id)

      assert {:ok, %EventResult{result_data: %PollResult{option_id: "1"}}} =
               EventResults.create_event_result(%{
                 launched_event_id: launched_event.id,
                 participant_id: participant.id,
                 result_data: %{option_id: "1"}
               })
    end
  end
end
