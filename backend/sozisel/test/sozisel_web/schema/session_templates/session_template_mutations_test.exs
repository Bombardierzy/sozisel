defmodule SoziselWeb.Schema.SessionTemplateMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @create_template """
  mutation CreateTemplate($input: CreateSessionTemplateInput!) {
    createSessionTemplate(input: $input) {
      id
      name
      estimatedTime
      isAbstract
      isPublic
      owner {
        id
      }
      agendaEntries {
        id
        name
        startMinute
      }
    }
  }
  """

  @update_template """
  mutation UpdateTemplate($input: UpdateSessionTemplateInput!) {
    updateSessionTemplate(input: $input) {
      id
      name
      estimatedTime
      isAbstract
      isPublic
      owner {
        id
      }
      agendaEntries {
        id
        name
        startMinute
      }
    }
  }
  """

  @delete_template """
  mutation UpdateTemplate($id: ID!) {
    deleteSessionTemplate(id: $id) {
      id
      deletedAt
    }
  }
  """

  describe "Session template mutations should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    test "create a new template", ctx do
      variables = %{
        input: %{
          name: "template",
          estimatedTime: 10,
          isAbstract: false,
          isPublic: false,
          agendaEntries: [%{name: "agenda point", startMinute: 1}]
        }
      }

      assert %{
               data: %{
                 "createSessionTemplate" => %{
                   "id" => _,
                   "name" => "template",
                   "estimatedTime" => 10,
                   "agendaEntries" => entries
                 }
               }
             } = run_query(ctx.conn, @create_template, variables)

      assert entries |> length == 1
    end

    test "update an existing template", ctx do
      template = insert(:template, user_id: ctx.user.id)
      _ = insert(:agenda_entry, session_template_id: template.id)

      variables = %{
        input: %{
          id: template.id,
          name: "new name",
          estimatedTime: 10,
          isAbstract: false,
          isPublic: false,
          agendaEntries: []
        }
      }

      assert %{
               data: %{
                 "updateSessionTemplate" => %{
                   "id" => _,
                   "name" => "new name",
                   "estimatedTime" => 10,
                   "agendaEntries" => []
                 }
               }
             } = run_query(ctx.conn, @update_template, variables)
    end

    test "soft delete an existing template", ctx do
      template = insert(:template, user_id: ctx.user.id)

      variables = %{
        id: template.id
      }

      assert %{
               data: %{
                 "deleteSessionTemplate" => %{
                   "id" => _,
                   "deletedAt" => deleted_at
                 }
               }
             } = run_query(ctx.conn, @delete_template, variables)

      assert not is_nil(deleted_at)
    end

    test "forbid create by unauthorized user" do
      variables = %{
        input: %{
          name: "template",
          estimatedTime: 10,
          isAbstract: false,
          isPublic: false,
          agendaEntries: [%{name: "agenda point", startMinute: 1}]
        }
      }

      assert %{
               data: %{
                 "createSessionTemplate" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(), @create_template, variables)
    end

    test "forbid update/delete by non-owner", ctx do
      template = insert(:template, user_id: ctx.user.id)
      other_user = insert(:user)
      other_conn = test_conn(other_user)

      variables = %{
        input: %{
          id: template.id,
          name: "new name"
        }
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @update_template, variables)

      variables = %{
        id: template.id
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @delete_template, variables)
    end
  end
end
