defmodule Sozisel.Events.EventTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Events

  import Sozisel.Factory

  describe "events" do
    test "list_events/0 returns all events" do
      template = insert(:template)
      event = insert(:random_event, session_template_id: template.id)

      assert Events.list_events() == [event]
    end

    test "list_template_events/1 returns all template events" do
      template = insert(:template)
      event = insert(:random_event, session_template_id: template.id)

      assert Events.list_template_events(template.id) == [event]
    end

    test "get_event!/1 returns the event with given id" do
      template = insert(:template)
      event = insert(:random_event, session_template_id: template.id)

      assert Events.get_event!(event.id) == event
    end

    test "change_event/1 returns a event changeset" do
      template = insert(:template)
      event = insert(:random_event, session_template_id: template.id)

      assert %Ecto.Changeset{} = Events.change_event(event)
    end
  end
end
