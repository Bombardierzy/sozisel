defmodule Sozisel.Events.Whiteboards.WhiteboardSummaryTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.EventResults
  alias Sozisel.Model.Whiteboards.{Whiteboard, WhiteboardResult}

  describe "whiteboard summary" do
    setup do
      template = insert(:template)
      session = insert(:session, session_template_id: template.id)

      event = %{
        session_template_id: template.id,
        name: "some whiteboard",
        start_time: 45,
        event_data: %Whiteboard{
          task: "Draw a bomb."
        }
      }

      whiteboard = insert(:whiteboard_event, event)

      launched_event = insert(:launched_event, session_id: session.id, event_id: whiteboard.id)

      [
        whiteboard: whiteboard,
        session: session,
        template: template,
        launched_event: launched_event
      ]
    end

    test "return valid whiteboard summary", ctx do
      p1 = insert(:participant, session_id: ctx.session.id)
      p2 = insert(:participant, session_id: ctx.session.id)
      p3 = insert(:participant, session_id: ctx.session.id)

      for {p, path, text, used_time} <- [
            {p1, "some path", "some text", 32.2},
            {p2, "/tmp/task/bomb.png", nil, 60},
            {p3, "/tmp/whiteboard/bomb.png", "This is a bomb", 47.1}
          ] do
        assert {:ok, _result} =
                 EventResults.create_event_result(%{
                   launched_event_id: ctx.launched_event.id,
                   participant_id: p.id,
                   result_data: %{
                     path: path,
                     text: text,
                     used_time: used_time
                   }
                 })
      end

      assert %{
               average_used_time: 46.43,
               id: _,
               participants_whiteboard_tasks: [
                 %{
                   additional_text: "some text",
                   email: _,
                   full_name: _,
                   image_path: "some path",
                   used_time: 32.2
                 },
                 %{
                   additional_text: nil,
                   email: _,
                   full_name: _,
                   image_path: "/tmp/task/bomb.png",
                   used_time: 60.0
                 },
                 %{
                   additional_text: "This is a bomb",
                   email: _,
                   full_name: _,
                   image_path: "/tmp/whiteboard/bomb.png",
                   used_time: 47.1
                 }
               ],
               task: "Draw a bomb."
             } = WhiteboardResult.whiteboard_summary(ctx.launched_event.id)
    end
  end
end
