defmodule Sozisel.Events.LaunchedEventsTest do
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
      event = insert(:random_event, session_template_id: template.id)

      session = insert(:session, session_template_id: template.id)
      secondary_session = insert(:session, session_template_id: template.id)

      [
        event: event,
        session: session,
        secondary_session: secondary_session,
        event_id: event.id,
        session_id: session.id
      ]
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

    test "create_launched_event/1 returns an error on retrying to insert again", ctx do
      assert {:ok, %LaunchedEvent{}} =
               LaunchedEvents.create_launched_event(@valid_attrs |> Map.merge(ctx))

      # allow to launch event with another session
      assert {:ok, %LaunchedEvent{}} =
               LaunchedEvents.create_launched_event(
                 @valid_attrs
                 |> Map.merge(ctx)
                 |> Map.put(:session_id, ctx.secondary_session.id)
               )

      assert {:error, %Ecto.Changeset{}} =
               LaunchedEvents.create_launched_event(@valid_attrs |> Map.merge(ctx))
    end
  end
end
