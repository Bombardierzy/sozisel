defmodule Sozise.Events.WhiteboardTest do
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

  defp whiteboard_fixture(attrs \\ %{}) do
    {:ok, whiteboard} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Events.create_event()

    whiteboard
  end

  describe "whiteboard events" do
    test "create_event/1 with valid data creates a event" do
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
      whiteboard = whiteboard_fixture(%{session_template_id: template.id})

      assert {:ok, %Event{} = event} = Events.update_event(whiteboard, @update_attrs)

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
      whiteboard = whiteboard_fixture(%{session_template_id: template.id})

      assert {:error, %Ecto.Changeset{}} = Events.update_event(whiteboard, @invalid_attrs)

      assert whiteboard == Events.get_event!(whiteboard.id)
    end
  end
end
