defmodule Sozisel.Events.WhiteboardResultsTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias EventResults.EventResult
  alias Sozisel.Model.Whiteboards.{Whiteboard, WhiteboardResult}

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

    @invalid_attrs %{
      result_data: nil
    }

    setup do
      template = insert(:template)
      session = insert(:session, session_template_id: template.id)

      event = %{
        session_template_id: template.id,
        name: "some whiteboard",
        start_time: 125,
        event_data: %Whiteboard{
          task: "Draw three bombs."
        }
      }

      whiteboard = insert(:whiteboard_event, event)

      launched_event = insert(:launched_event, session_id: session.id, event_id: whiteboard.id)

      [session: session, launched_event: launched_event]
    end

    def event_result_fixture(attrs \\ %{}) do
      {:ok, event_result} =
        attrs
        |> Enum.into(@valid_attrs)
        |> EventResults.create_event_result()

      event_result
    end

    test "create_event_result/1 with valid data creates a event_result", ctx do
      participant = insert(:participant, session_id: ctx.session.id)

      event_result =
        event_result_fixture(%{
          launched_event_id: ctx.launched_event.id,
          participant_id: participant.id
        })

      assert event_result.result_data == %WhiteboardResult{
               path: "some path",
               text: "some text",
               used_time: 143.2
             }

      assert event_result.launched_event_id == ctx.launched_event.id
      assert event_result.participant_id == participant.id
    end

    test "create_event_result/1 with invalid data returns error changeset or unmatched event result error",
         ctx do
      participant = insert(:participant, session_id: ctx.session.id)

      assert {:error, :unmatched_event_result} =
               EventResults.create_event_result(%{
                 launched_event_id: ctx.launched_event.id,
                 participant_id: participant.id,
                 event_data: %{}
               })
    end

    test "update_event_result/2 with valid data updates the event_result", ctx do
      participant = insert(:participant, session_id: ctx.session.id)

      event_result =
        event_result_fixture(%{
          launched_event_id: ctx.launched_event.id,
          participant_id: participant.id
        })

      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(event_result, @update_attrs)

      assert event_result.result_data == %WhiteboardResult{
               path: "some other path",
               text: "some other text",
               used_time: 121.1
             }

      assert event_result.launched_event_id == ctx.launched_event.id
      assert event_result.participant_id == participant.id
    end

    test "update_event_result/2 with invalid data returns error changeset", ctx do
      participant = insert(:participant, session_id: ctx.session.id)

      event_result =
        event_result_fixture(%{
          launched_event_id: ctx.launched_event.id,
          participant_id: participant.id
        })

      assert {:error, %Ecto.Changeset{}} =
               EventResults.update_event_result(event_result, @invalid_attrs)
    end

    test "delete_event_result/1 deletes the event_result", ctx do
      participant = insert(:participant, session_id: ctx.session.id)

      event_result =
        event_result_fixture(%{
          launched_event_id: ctx.launched_event.id,
          participant_id: participant.id
        })

      assert {:ok, %EventResult{}} = EventResults.delete_event_result(event_result)
      assert_raise Ecto.NoResultsError, fn -> EventResults.get_event_result!(event_result.id) end
    end
  end
end
