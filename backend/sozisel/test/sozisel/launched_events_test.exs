defmodule Sozisel.LaunchedEventsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.{LaunchedEvents, LaunchedEvents.LaunchedEvent}

  import Sozisel.Factory

  describe "launched_events" do
    @valid_attrs %{}
    @invalid_attrs %{}

    def launched_event_fixture(attrs \\ %{}) do
      {:ok, launched_event} =
        attrs
        |> Enum.into(@valid_attrs)
        |> LaunchedEvents.create_launched_event()

      launched_event
    end

    setup do
      template = insert(:template)
      event = insert(:event, session_template_id: template.id)

      session = insert(:session, session_template_id: template.id)
      [event: event, session: session, event_id: event.id, session_id: session.id]
    end

    test "get_launched_event!/1 returns the launched_event with given id", ctx do
      launched_event = launched_event_fixture(ctx)
      assert LaunchedEvents.get_launched_event!(launched_event.id) == launched_event
    end

    test "create_launched_event/1 with valid data creates a launched_event", ctx do
      assert {:ok, %LaunchedEvent{}} =
               LaunchedEvents.create_launched_event(@valid_attrs |> Map.merge(ctx))
    end

    test "create_launched_event/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = LaunchedEvents.create_launched_event(@invalid_attrs)
    end

    test "change_launched_event/1 returns a launched_event changeset", ctx do
      launched_event = launched_event_fixture(ctx)
      assert %Ecto.Changeset{} = LaunchedEvents.change_launched_event(launched_event)
    end
  end
end
