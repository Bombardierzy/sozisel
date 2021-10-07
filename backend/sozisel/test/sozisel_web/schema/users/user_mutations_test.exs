defmodule SoziselWeb.Schema.Users.UserMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @register_mutation """
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      email
      firstName
      lastName
    }
  }
  """

  @login_mutation """
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
  """

  describe "User mutations should" do
    setup do
      [conn: test_conn()]
    end

    test "register a new user", ctx do
      variables = %{
        input: %{
          email: email = "some@email.com",
          first_name: first_name = "some name",
          last_name: last_name = "some last name",
          password: "password"
        }
      }

      assert %{
               data: %{
                 "register" => %{
                   "id" => _,
                   "email" => ^email,
                   "firstName" => ^first_name,
                   "lastName" => ^last_name
                 }
               }
             } = run_query(ctx.conn, @register_mutation, variables)
    end

    test "return an error on invalid registration", ctx do
      user = insert(:user)

      variables = %{
        input: %{
          email: user.email,
          first_name: "name",
          last_name: "name",
          password: "password"
        }
      }

      # email already taken
      assert %{
               errors: [
                 %{"message" => "email has already been taken"}
               ]
             } = run_query(ctx.conn, @register_mutation, variables)

      # invalid email format
      assert %{
               errors: [
                 %{"message" => "email has invalid format"}
               ]
             } =
               run_query(
                 ctx.conn,
                 @register_mutation,
                 put_in(variables, [:input, :email], "wrong email")
               )
    end

    test "login an existing user", ctx do
      user = insert(:user, password: "password")

      variables = %{
        input: %{
          email: user.email,
          password: "password"
        }
      }

      assert %{
               data: %{
                 "login" => %{
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @login_mutation, variables)
    end

    test "return an error if user failed to login", ctx do
      user = insert(:user)

      variables = %{
        input: %{
          email: "wrong@email.com",
          password: "some random password"
        }
      }

      # invalid email
      assert %{
               errors: [
                 %{"message" => "unauthorized"}
               ]
             } = run_query(ctx.conn, @login_mutation, variables)

      # invalid password
      assert %{
               errors: [
                 %{"message" => "unauthorized"}
               ]
             } =
               run_query(
                 ctx.conn,
                 @login_mutation,
                 put_in(variables, [:input, :email], user.email)
               )
    end
  end
end
