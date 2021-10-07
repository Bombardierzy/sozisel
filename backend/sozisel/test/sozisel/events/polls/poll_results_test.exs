defmodule Sozisel.Events.Polls.PollResultsTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.{EventResults, Events}
  alias EventResults.EventResult
  alias Sozisel.Model.Polls.PollResult

  describe "poll results" do
    @valid_attrs %{
      result_data: %{
        option_ids: ["1"]
      }
    }
    @update_attrs_with_one_answer %{
      result_data: %{
        option_ids: ["2"]
      }
    }
    @update_attrs_with_two_answers %{
      result_data: %{
        option_ids: ["2", "1"]
      }
    }
    @update_attrs_for_poll_event_with_multi_choice %{
      name: "some updated poll name",
      start_minute: 43,
      event_data: %{
        question: "Do you like being at all?",
        is_multi_choice: true,
        options: [
          %{id: "1", text: "yes"},
          %{id: "2", text: "no"},
          %{id: "3", text: "Please, more questions like that!"}
        ]
      }
    }

    setup do
      template = insert(:template)
      event = insert(:poll_event, session_template_id: template.id)
      session = insert(:session, session_template_id: template.id)
      launched_event = insert(:launched_event, session_id: session.id, event_id: event.id)
      participant = insert(:participant, session_id: session.id)

      event_result =
        insert(:event_result,
          launched_event: launched_event,
          participant: participant,
          result_data: random_event_result(event.event_data)
        )

      [
        event: event,
        event_result: event_result,
        launched_event: launched_event,
        participant: participant
      ]
    end

    test "create_event_result/1 with valid poll data creates a event_result", ctx do
      # just delete it as it is created in fixture
      Repo.delete(ctx.event_result)

      valid_attrs =
        @valid_attrs
        |> Map.put(:launched_event_id, ctx.launched_event.id)
        |> Map.put(:participant_id, ctx.participant.id)

      assert {:ok, %EventResult{} = event_result} = EventResults.create_event_result(valid_attrs)

      assert event_result.result_data == %PollResult{
               option_ids: ["1"]
             }

      assert ctx.event_result.launched_event_id == ctx.launched_event.id
      assert ctx.event_result.participant_id == ctx.participant.id
    end

    test "update_event_result/2 with valid quiz data updates the event_result", ctx do
      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(ctx.event_result, @update_attrs_with_one_answer)

      assert event_result.result_data == %PollResult{
               option_ids: ["2"]
             }

      Events.update_event(ctx.event, @update_attrs_for_poll_event_with_multi_choice)

      assert {:ok, %EventResult{} = event_result} =
               EventResults.update_event_result(ctx.event_result, @update_attrs_with_two_answers)

      assert event_result.result_data == %PollResult{
               option_ids: ["2", "1"]
             }

      assert event_result.launched_event_id == ctx.launched_event.id
      assert event_result.participant_id == ctx.participant.id
    end

    test "multi choice poll result verification" do
      template = insert(:template)
      session = insert(:session, session_template_id: template.id)
      participant = insert(:participant, session_id: session.id)

      poll = insert(:poll_event, session_template_id: template.id)
      launched_event = insert(:launched_event, event_id: poll.id, session_id: session.id)

      try_create = fn options ->
        EventResults.create_event_result(%{
          launched_event_id: launched_event.id,
          participant_id: participant.id,
          result_data: %{option_ids: options}
        })
      end

      # multi choice -> false, option_ids > 1
      assert {:error, :unmatched_event_result} = try_create.(["1", "2"])

      # multi choice -> false, non existent option
      assert {:error, :unmatched_event_result} = try_create.(["random id"])

      Events.update_event(poll, @update_attrs_for_poll_event_with_multi_choice)

      # multi choice -> true, empty option_ids
      assert {:error, :unmatched_event_result} = try_create.([])

      # multi choice -> true, duplicated options
      assert {:error, :unmatched_event_result} = try_create.(["1", "1"])

      # multi choice -> true, unknown options
      assert {:error, :unmatched_event_result} = try_create.(["random option", "another one"])

      # success
      assert {:ok, %EventResult{result_data: %PollResult{option_ids: option_ids}}} =
               try_create.(["1", "2"])

      assert option_ids == option_ids
    end
  end
end
