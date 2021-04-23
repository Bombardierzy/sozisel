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

  @clone_template """
  mutation CloneTemplate($id: ID!) {
    cloneSessionTemplate(id: $id) {
      id
      name
      agendaEntries {
        id
        name
      }
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

    test "clone session template", ctx do
      template = insert(:template, is_public: true, user_id: ctx.user.id)
      agenda_entry = insert(:agenda_entry, session_template_id: template.id)

      name = template.name

      variables = %{
        id: template.id
      }

      assert %{
               data: %{
                 "cloneSessionTemplate" => %{
                   "id" => _,
                   "name" => ^name,
                   "agendaEntries" => [%{"id" => entry_id, "name" => entry_name}]
                 }
               }
             } = run_query(ctx.conn, @clone_template, variables)

      assert entry_id != agenda_entry.id
      assert entry_name == agenda_entry.name

      # template is public so another user should be able to clone that
      assert %{
               data: %{
                 "cloneSessionTemplate" => %{
                   "id" => _,
                   "name" => ^name,
                   "agendaEntries" => [%{"id" => entry_id, "name" => entry_name}]
                 }
               }
             } = run_query(test_conn(insert(:user)), @clone_template, variables)

      assert entry_id != agenda_entry.id
      assert entry_name == agenda_entry.name

      assert %{errors: nil} =
               run_query(ctx.conn, @update_template, %{
                 input: %{id: template.id, is_public: false}
               })

      # template is not private so forbid others but for the owner to clone it
      assert %{errors: nil} = run_query(ctx.conn, @clone_template, %{id: template.id})

      assert %{
               data: %{
                 "cloneSessionTemplate" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(insert(:user)), @clone_template, %{id: template.id})
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
