defmodule SoziselWeb.Schema.SessionTemplates.SessionTemplateQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @get_session_template """
  query GetSessionTemplate($id: ID!) {
    sessionTemplate(id: $id) {
      id
    }
  }
  """

  @basic_search_template """
  query SearchTemplate {
    searchSessionTemplates {
      id
      name
      estimatedTime
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

  @search_template_with_params """
  query SearchPublicTemplates($includePublic: Boolean!, $name: String!) {
    searchSessionTemplates(includePublic: $includePublic, name: $name) {
      id
      name
      estimatedTime
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
  mutation DeleteTemplate($id: ID!) {
    deleteSessionTemplate(id: $id) {
      id
      deletedAt
    }
  }
  """

  describe "Session template queries should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    test "return session template with given id", ctx do
      template_id = insert(:template, user_id: ctx.user.id).id

      assert %{
               data: %{
                 "sessionTemplate" => %{"id" => ^template_id}
               }
             } = run_query(ctx.conn, @get_session_template, %{id: template_id})

      other_conn = test_conn(insert(:user))

      assert %{
               data: %{
                 "sessionTemplate" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(other_conn, @get_session_template, %{id: template_id})
    end

    test "search templates with no params", ctx do
      insert(:template, user_id: ctx.user.id)
      insert(:template, user_id: ctx.user.id)
      insert(:template)

      assert %{
               data: %{
                 "searchSessionTemplates" => templates
               }
             } = run_query(ctx.conn, @basic_search_template, %{})

      assert templates |> length == 2
    end

    test "search user's Templates", ctx do
      insert(:template, is_public: false, name: "Sozisel", user_id: ctx.user.id)
      insert(:template, is_public: true, name: "other", user_id: ctx.user.id)
      insert(:template, name: "Sozisel")

      variables = %{
        includePublic: false,
        name: "ozi"
      }

      assert %{
               data: %{
                 "searchSessionTemplates" => [
                   %{
                     "id" => _,
                     "name" => "Sozisel",
                     "isPublic" => false,
                     "owner" => %{
                       "id" => _id
                     }
                   }
                 ]
               }
             } = run_query(ctx.conn, @search_template_with_params, variables)
    end

    test "search public Templates", ctx do
      insert(:template, is_public: true, name: "other")
      insert(:template, is_public: false, name: "other2")

      variables = %{
        includePublic: true,
        name: "oth"
      }

      assert %{
               data: %{
                 "searchSessionTemplates" => [
                   %{
                     "id" => _,
                     "name" => "other",
                     "isPublic" => true
                   }
                 ]
               }
             } = run_query(ctx.conn, @search_template_with_params, variables)
    end

    test "search for non-deleted templates", ctx do
      deleted_template = insert(:template, name: "other", user_id: ctx.user.id)
      insert(:template, name: "Sozisel", user_id: ctx.user.id)

      variables = %{
        id: deleted_template.id
      }

      run_query(ctx.conn, @delete_template, variables)

      assert %{
               data: %{
                 "searchSessionTemplates" => [
                   %{
                     "id" => _,
                     "name" => "Sozisel"
                   }
                 ]
               }
             } = run_query(ctx.conn, @basic_search_template, %{})
    end
  end
end
