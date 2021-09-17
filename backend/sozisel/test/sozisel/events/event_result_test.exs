defmodule Sozisel.Events.EventResultTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias EventResults.EventResult

  describe "event_results" do
    @invalid_attrs %{participant_token: nil, result_data: nil}

    def random_event_result_fixture() do
      template = insert(:template)
      event = insert(:random_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant = insert(:participant, session_id: session.id)

      insert(:event_result,
        launched_event: launched_event,
        participant: participant,
        result_data: random_event_result(event.event_data)
      )
    end

    test "list_event_results/0 returns all event_results" do
      event_result = random_event_result_fixture()

      assert EventResults.list_event_results() == [event_result]
    end

    test "get_event_result!/1 returns the event_result with given id" do
      event_result = random_event_result_fixture()

      assert EventResults.get_event_result!(event_result.id) == event_result
    end

    test "create_event_result/1 with invalid data returns error changeset or unmatched event result error" do
      template = insert(:template)
      event = insert(:whiteboard_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant = insert(:participant, session_id: session.id)

      assert {:error, :unmatched_event_result} =
               EventResults.create_event_result(%{
                 launched_event_id: launched_event.id,
                 participant_id: participant.id,
                 event_data: %{}
               })
    end

    test "update_event_result/2 with invalid data returns error changeset" do
      event_result = random_event_result_fixture()

      assert {:error, %Ecto.Changeset{}} =
               EventResults.update_event_result(event_result, @invalid_attrs)

      assert event_result == EventResults.get_event_result!(event_result.id)
    end

    test "delete_event_result/1 deletes the event_result" do
      event_result = random_event_result_fixture()

      assert {:ok, %EventResult{}} = EventResults.delete_event_result(event_result)
      assert_raise Ecto.NoResultsError, fn -> EventResults.get_event_result!(event_result.id) end
    end

    test "change_event_result/1 returns a event_result changeset" do
      event_result = random_event_result_fixture()

      assert %Ecto.Changeset{} = EventResults.change_event_result(event_result)
    end
  end
end
