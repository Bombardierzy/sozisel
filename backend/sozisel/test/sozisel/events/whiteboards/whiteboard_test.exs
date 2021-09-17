defmodule Sozise.Events.Whiteboards.WhiteboardTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Events
  alias Sozisel.Model.Events.Event
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
    {:ok, whiteboard} =
      @valid_attrs
      |> Map.put(:session_template_id, template.id)
      |> Events.create_event()

    whiteboard
  end

  describe "whiteboard events" do
    test "create_event/1 with valid whiteboard data creates an event" do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)

      assert {:ok, %Event{} = event} = Events.create_event(valid_attrs)

      assert event.event_data == %Whiteboard{
               task: "Draw a bomb."
             }

      assert event.name == "some whiteboard"
      assert event.start_minute == 26
    end

    test "create_event/1 with invalid whiteboard data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Events.create_event(@invalid_attrs)
    end

    test "update_event/2 with valid whiteboard data updates the event" do
      template = insert(:template)
      whiteboard = whiteboard_fixture(template)

      assert {:ok, %Event{} = event} = Events.update_event(whiteboard, @update_attrs)

      assert event.name == "some updated whiteboard name"
      assert event.duration_time_sec == 205
      assert event.event_data.task == "Draw two bombs."
    end

    test "update_event/2 with invalid whiteboard data returns error changeset" do
      template = insert(:template)
      whiteboard = whiteboard_fixture(template)

      assert {:error, %Ecto.Changeset{}} = Events.update_event(whiteboard, @invalid_attrs)

      assert whiteboard == Events.get_event!(whiteboard.id)
    end

    test "delete_event/1 deletes the event" do
      template = insert(:template)
      event = whiteboard_fixture(template)

      assert {:ok, %Event{}} = Events.delete_event(event)
      assert_raise Ecto.NoResultsError, fn -> Events.get_event!(event.id) end
    end
  end
end
