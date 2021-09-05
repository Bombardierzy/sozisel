defmodule SoziselWeb.Schema.Events.WhiteboardMutationsTest do
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
    deleteWhiteboard(id: $id) {
      id
      name
    }
  }
  """
  describe "Whiteboard mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: template.id, user_id: user.id)
      [conn: test_conn(user), user: user, template: template, session: session]
    end

    test "create a new whiteboard", ctx do
      variables = %{
        input: %{
          name: "some whiteboard",
          duration_time_sec: 180,
          startMinute: 24,
          eventData: %{
            task: "Draw a bomb."
          },
          sessionTemplateId: ctx.template.id
        }
      }

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
                     "id" => _
                   }
                 }
               }
             } = run_query(ctx.conn, @create_whiteboard, variables)
    end

    test "update an existing whiteboard", ctx do
      whiteboard = insert(:whiteboard_event, session_template_id: ctx.template.id)

      variables = %{
        input: %{
          id: whiteboard.id,
          eventData: %{
            task: "Draw two bombs."
          }
        }
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

    test "delete whiteboard", ctx do
      %{id: whiteboard_id} = insert(:whiteboard_event, session_template_id: ctx.template.id)

      variables = %{
        id: whiteboard_id
      }

      assert %{
               data: %{
                 "deleteWhiteboard" => %{
                   "id" => ^whiteboard_id
                 }
               }
             } = run_query(ctx.conn, @delete_whiteboard, variables)

      assert Repo.get(Event, whiteboard_id) == nil
    end

    test "forbid create by unauthorized user", ctx do
      template = insert(:template, user_id: ctx.user.id)

      variables = %{
        input: %{
          name: "some whiteboard",
          durationTimeSec: 180,
          startMinute: 27,
          eventData: %{
            task: "Draw a bomb."
          },
          sessionTemplateId: template.id
        }
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

      variables = %{
        input: %{
          id: whiteboard.id,
          name: "updated whiteboard",
          durationTimeSec: 205,
          startMinute: 12,
          eventData: %{
            task: "Draw two bombs."
          }
        }
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
