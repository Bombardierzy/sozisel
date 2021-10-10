defmodule SoziselWeb.Schema.Users.UserQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @me_query """
  query Me {
    me {
      email
      firstName
      lastName
      sessionTemplates {
        id
      }
      sessionResources {
        id
        path
        filename
      }
    }
  }
  """

  describe "User queries should" do
    setup do
      [me: insert(:user)]
    end

    test "return current user", ctx do
      conn = test_conn(ctx.me)
      _ = insert(:template, user_id: ctx.me.id)
      session_resource = insert(:session_resource, %{user_id: ctx.me.id})

      session_resource_id = session_resource.id
      session_resource_filename = session_resource.filename
      session_resource_path = session_resource.path

      %{email: email, first_name: first_name, last_name: last_name} = ctx.me

      assert %{
               data: %{
                 "me" => %{
                   "email" => ^email,
                   "firstName" => ^first_name,
                   "lastName" => ^last_name,
                   "sessionTemplates" => templates,
                   "sessionResources" => [
                     %{
                       "filename" => ^session_resource_filename,
                       "id" => ^session_resource_id,
                       "path" => ^session_resource_path
                     }
                   ]
                 }
               }
             } = run_query(conn, @me_query, %{})

      assert templates |> length == 1
    end

    test "return proper session_resources to current user", ctx do
      user = insert(:user)
      conn = test_conn(user)

      _ = insert(:session_resource, %{user_id: ctx.me.id})
      _ = insert(:session_resource, %{user_id: user.id})
      _ = insert(:session_resource, %{user_id: user.id})

      assert %{
               data: %{
                 "me" => %{
                   "sessionResources" => session_resources
                 }
               }
             } = run_query(conn, @me_query, %{})

      assert session_resources |> length == 2
    end

    test "return an error on me query if user is not authorized" do
      conn = test_conn()

      assert %{
               errors: [%{"message" => "unauthorized"}]
             } = run_query(conn, @me_query, %{})
    end
  end
end
