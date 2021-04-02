defmodule SoziselWeb.Schema.UserQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @me_query """
  query Me {
    me {
      email
      firstName
      lastName
    }
  }
  """

  describe "User queries should" do
    setup do
      [me: insert(:user)]
    end

    test "return current user", ctx do
      conn = test_conn(ctx.me)
      %{email: email, first_name: first_name, last_name: last_name} = ctx.me

      assert %{
               data: %{
                 "me" => %{
                   "email" => ^email,
                   "firstName" => ^first_name,
                   "lastName" => ^last_name
                 }
               }
             } = run_query(conn, @me_query, %{})
    end

    test "return an error on me query if user is not authorized", ctx do
      conn = test_conn()

      assert %{
               errors: [%{"message" => "unauthorized"}]
             } = run_query(conn, @me_query, %{})
    end
  end
end
