defmodule Sozisel.Events.Polls.PollSummaryTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias Sozisel.Model.Polls.{Poll, PollOption, PollResult}

  describe "poll summary" do
    setup do
      template = insert(:template)
      session = insert(:session, session_template_id: template.id)

      event = %{
        session_template_id: template.id,
        name: "some poll",
        start_time: 120,
        event_data: %Poll{
          question: "How are you?",
          is_multi_choice: true,
          options: [
            %PollOption{id: "1", text: "good"},
            %PollOption{id: "2", text: "bad"},
            %PollOption{id: "3", text: "meh"}
          ]
        }
      }

      poll = insert(:poll_event, event)

      launched_event = insert(:launched_event, session_id: session.id, event_id: poll.id)

      [poll: poll, session: session, template: template, launched_event: launched_event]
    end

    test "return valid poll summary", ctx do
      p1 = insert(:participant, session_id: ctx.session.id)
      p2 = insert(:participant, session_id: ctx.session.id)
      p3 = insert(:participant, session_id: ctx.session.id)

      for {p, options} <- [{p1, "1"}, {p2, ["1", "2"]}, {p3, "2"}] do
        assert {:ok, _result} =
                 EventResults.create_event_result(%{
                   launched_event_id: ctx.launched_event.id,
                   participant_id: p.id,
                   result_data: %{
                     option_ids: List.wrap(options)
                   }
                 })
      end

      assert %{
               question: "How are you?",
               total_voters: 3,
               option_summaries: [
                 %{
                   id: "1",
                   text: "good",
                   votes: 2
                 },
                 %{
                   id: "2",
                   text: "bad",
                   votes: 2
                 },
                 %{
                   id: "3",
                   text: "meh",
                   votes: 0
                 }
               ]
             } = PollResult.poll_summary(ctx.launched_event.id)
    end
  end
end
