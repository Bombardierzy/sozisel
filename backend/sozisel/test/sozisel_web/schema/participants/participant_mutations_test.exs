defmodule SoziselWeb.Schema.ParticipantMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @create_participant """
  mutation CreateParticipant($input: JoinParticipantToSessionInput!) {
    createParticipant(input: $input) {
      id
      token
    }
  }
  """

  describe "Participant mutations should" do
    setup do
      [conn: test_conn()]
    end

    test "create a new participant", ctx do
      session = insert(:session)

      variables = %{
        input: %{
          session_id: session.id,
          email: "some@email.com",
          full_name: "Some name",
        }
      }

      assert %{
               data: %{
                 "createParticipant" => %{
                   "id" => _,
                   "token" => _
                 }
               }
             } = run_query(ctx.conn, @create_participant, variables)
      end
  end
end
