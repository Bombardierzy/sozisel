defmodule Sozise.Events.WhiteboardTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Events
  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.EventResults
  alias Sozisel.Model.EventResults.EventResult
  alias Sozisel.Model.Whiteboards.Whiteboard

  @valid_attrs %{
    name: "some whiteboard",
    duration_time_sec: 180,
    start_minute: 26,
    event_data: %{
      task: "Draw a bomb."
    }
  }

  @update_attrs %{
    name: "some updated whiteboard name",
    duration_time_sec: 205,
    event_data: %{
      task: "Draw two bombs."
    }
  }

  @invalid_attrs %{
    name: "some whiteboard",
    duration_time_sec: 205,
    event_data: %{
      task: nil
    }
  }

  defp whiteboard_fixture(template) do
    {:ok, event} =
      @valid_attrs
      |> Map.put(:session_template_id, template.id)
      |> Events.create_event()

    event
  end

  describe "whiteboard events" do
    test "create_event/1 with valid whiteboar data creates an event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{} = event} = Events.create_event(valid_attrs)
              
      assert event = %Event{
        name: "some whiteboard",
        duration_time_sec: 180,
        start_minute: 26,
        event_data: %Whiteboard{
          task: "Draw a bomb."
        }
      }
    end

    test "create_event/1 with invalid whiteboard data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/2 with valid whiteboard data updates the event" do
      template = insert(:template)
      event = whiteboard_fixture(template)

      assert {:ok, %Event{} = event} = Events.update_event(event, @update_attrs)

      assert event = %Event{
        name: "some updated whiteboard name",
        duration_time_sec: 205,
        event_data: %{
          task: "Draw two bombs."
        }
      }
    end

    test "update_event/2 with invalid whiteboard data returns error changeset" do
      template = insert(:template)
      event = whiteboard_fixture(template)

      assert {:error, %Ecto.Changeset{}} = Events.update_event(event, @invalid_attrs)

      assert event == Events.get_event!(event.id)
    end

    # test "creating event result with valid data should success" do
    #   template = insert(:template)
    #   session = insert(:session, session_template_id: template.id)
    #   participant = insert(:participant, session_id: session.id)

    #   poll = poll_fixture(template)
    #   launched_event = insert(:launched_event, event_id: poll.id, session_id: session.id)

    #   assert {:ok, %EventResult{result_data: %PollResult{option_ids: ["1"]}}} =
    #            EventResults.create_event_result(%{
    #              launched_event_id: launched_event.id,
    #              participant_id: participant.id,
    #              result_data: %{option_ids: ["1"]}
    #            })

    #   multi_choice_poll = poll_fixture(template)
    #   {:ok, _event} = Events.update_event(multi_choice_poll, @update_attrs)

    #   launched_event =
    #     insert(:launched_event, event_id: multi_choice_poll.id, session_id: session.id)

    #   assert {:ok, %EventResult{result_data: %PollResult{option_ids: ["1", "2"]}}} =
    #            EventResults.create_event_result(%{
    #              launched_event_id: launched_event.id,
    #              participant_id: participant.id,
    #              result_data: %{option_ids: ["1", "2"]}
    #            })
    # end

    # test "multi choice poll result verification" do
    #   template = insert(:template)
    #   session = insert(:session, session_template_id: template.id)
    #   participant = insert(:participant, session_id: session.id)

    #   poll = poll_fixture(template)
    #   launched_event = insert(:launched_event, event_id: poll.id, session_id: session.id)

    #   try_create = fn options ->
    #     EventResults.create_event_result(%{
    #       launched_event_id: launched_event.id,
    #       participant_id: participant.id,
    #       result_data: %{option_ids: options}
    #     })
    #   end

    #   # multi choice -> false, option_ids > 1
    #   assert {:error, :unmatched_event_result} = try_create.(["1", "2"])

    #   # multi choice -> false, non existent option
    #   assert {:error, :unmatched_event_result} = try_create.(["random id"])

    #   Events.update_event(poll, @update_attrs)

    #   # multi choice -> true, empty option_ids
    #   assert {:error, :unmatched_event_result} = try_create.([])

    #   # multi choice -> true, duplicated options
    #   assert {:error, :unmatched_event_result} = try_create.(["1", "1"])

    #   # multi choice -> true, unknown options
    #   assert {:error, :unmatched_event_result} = try_create.(["random option", "another one"])

    #   # success
    #   assert {:ok, %EventResult{result_data: %PollResult{option_ids: option_ids}}} =
    #            try_create.(["1", "2"])

    #   assert option_ids == option_ids
    # end
  end
end
