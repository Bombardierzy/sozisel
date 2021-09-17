defmodule Sozisel.Events.Whiteboards.WhiteboardResultsTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias EventResults.EventResult
  alias Sozisel.Model.Whiteboards.WhiteboardResult

  describe "whiteboard_results" do
    @valid_attrs %{
      result_data: %{
        path: "some path",
        text: "some text",
        used_time: 143.2
      }
    }

    @update_attrs %{
      result_data: %{
        path: "some other path",
        text: "some other text",
        used_time: 121.1
      }
    }

    setup do
      template = insert(:template)
      event = insert(:whiteboard_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant = insert(:participant, session_id: session.id)

      event_result =
        insert(:event_result,
          launched_event: launched_event,
          participant: participant,
          result_data: random_event_result(event.event_data)
        )

      [event_result: event_result, launched_event: launched_event, participant: participant]
    end

    test "create_event_result/1 with valid whiteboard data creates a event_result", ctx do
      # just delete it as it is created in fixture
      Repo.delete(ctx.event_result)

      valid_attrs =
        @valid_attrs
        |> Map.put(:launched_event_id, ctx.launched_event.id)
        |> Map.put(:participant_id, ctx.participant.id)

      assert {:ok, %EventResult{} = event_result} = EventResults.create_event_result(valid_attrs)

      assert event_result.result_data == %WhiteboardResult{
               path: "some path",
               text: "some text",
               used_time: 143.2
             }

      assert ctx.event_result.launched_event_id == ctx.launched_event.id
      assert ctx.event_result.participant_id == ctx.participant.id
    end

    test "update_event_result/2 with valid quiz data updates the event_result", ctx do
      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(ctx.event_result, @update_attrs)

      assert event_result.result_data == %WhiteboardResult{
               path: "some other path",
               text: "some other text",
               used_time: 121.1
             }

      assert event_result.launched_event_id == ctx.launched_event.id
      assert event_result.participant_id == ctx.participant.id
    end
  end
end
