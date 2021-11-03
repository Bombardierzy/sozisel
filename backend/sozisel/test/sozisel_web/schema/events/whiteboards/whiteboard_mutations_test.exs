defmodule SoziselWeb.Schema.Events.Whiteboards.WhiteboardMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events.Event

  @create_whiteboard """
  mutation CreateWhiteboard($input: CreateWhiteboardInput!) {
    createWhiteboard(input: $input) {
      id
      name
      durationTimeSec
      startMinute
      eventData {
        ... on Whiteboard {
          task
        }
      }
      sessionTemplate {
        id
      }
    }
  }
  """

  @update_whiteboard """
  mutation UpdateWhiteboard($input: UpdateWhiteboardInput!) {
    updateWhiteboard(input: $input) {
      id
      name
      durationTimeSec
      startMinute
      eventData {
        ... on Whiteboard {
          task
        }
      }
    }
  }
  """

  @delete_whiteboard """
  mutation DeleteWhiteboard($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
    }
  }
  """

  @valid_attrs_for_whiteboard_event %{
    name: "some whiteboard",
    duration_time_sec: 180,
    startMinute: 24,
    eventData: %{
      task: "Draw a bomb."
    }
  }

  @valid_attrs_for_update_whiteboard_event %{
    eventData: %{
      task: "Draw two bombs."
    }
  }

  describe "Whiteboard mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      [conn: test_conn(user), user: user, template: template]
    end

    test "create a new whiteboard", ctx do
      valid_attrs =
        Map.put(@valid_attrs_for_whiteboard_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      session_template_id = ctx.template.id

      assert %{
               data: %{
                 "createWhiteboard" => %{
                   "id" => _,
                   "name" => "some whiteboard",
                   "startMinute" => 24,
                   "durationTimeSec" => 180,
                   "eventData" => %{
                     "task" => "Draw a bomb."
                   },
                   "sessionTemplate" => %{
                     "id" => ^session_template_id
                   }
                 }
               }
             } = run_query(ctx.conn, @create_whiteboard, variables)
    end

    test "update an existing whiteboard", ctx do
      whiteboard = insert(:whiteboard_event, session_template_id: ctx.template.id)

      valid_attrs = Map.put(@valid_attrs_for_update_whiteboard_event, :id, whiteboard.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "updateWhiteboard" => %{
                   "id" => _,
                   "name" => _,
                   "eventData" => %{
                     "task" => "Draw two bombs."
                   }
                 }
               }
             } = run_query(ctx.conn, @update_whiteboard, variables)
    end

    test "soft delete an existing poll event", ctx do
      %{
        id: whiteboard_id,
        name: whiteboard_name
      } = insert(:whiteboard_event, session_template_id: ctx.template.id)

      variables = %{
        id: whiteboard_id
      }

      assert %{
               data: %{
                 "deleteEvent" => %{
                   "id" => ^whiteboard_id,
                   "name" => ^whiteboard_name
                 }
               }
             } = run_query(ctx.conn, @delete_whiteboard, variables)

      assert Repo.get(Event, whiteboard_id) == nil
    end

    test "forbid create whiteboard event by unauthorized user", ctx do
      valid_attrs =
        Map.put(@valid_attrs_for_whiteboard_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "createWhiteboard" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(), @create_whiteboard, variables)
    end

    test "forbid update/delete by non-owner", ctx do
      whiteboard = insert(:whiteboard_event, session_template_id: ctx.template.id)

      other_user = insert(:user)
      other_conn = test_conn(other_user)

      valid_attrs = Map.put(@valid_attrs_for_update_whiteboard_event, :id, whiteboard.id)

      variables = %{
        input: valid_attrs
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @update_whiteboard, variables)

      variables = %{
        id: whiteboard.id
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @delete_whiteboard, variables)
    end
  end
end
