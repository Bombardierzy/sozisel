defmodule SoziselWeb.Schema.ParticipantMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Sessions

  @create_participant """
  mutation JoinSession($input: JoinSessionInput!) {
    joinSession(input: $input) {
      token
    }
  }
  """

  describe "Participant mutations should" do
    setup do
      [conn: test_conn()]
    end

    test "create a new participant to session with out password", ctx do
      session = insert(:session)

      Sessions.update_session(session, %{entry_password: nil})

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name"
        }
      }

      assert %{
               data: %{
                 "joinSession" => %{
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "create a new participant to session with password", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "password123@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => %{
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when wrong password", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
          entry_password: "some_password@"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(ctx.conn, @create_participant, variables)
    end

    test "forbid create participant when password set but user do not pass it", ctx do
      session = insert(:session, entry_password: "password123@")

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name"
        }
      }

      assert %{
               data: %{
                 "joinSession" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(ctx.conn, @create_participant, variables)
    end
  end
end
