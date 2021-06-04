defmodule SoziselWeb.Schema.Participants.ParticipantQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @my_participation_query """
  query MyParticipation($token: String!) {
    myParticipation(token: $token) {
      id
      fullName
      email
    }
  }
  """

  describe "Participant queries should" do
    test "return current participant" do
      %{token: token, id: id, email: email} = insert(:participant)

      variables = %{
        token: token
      }

      assert %{
               data: %{
                 "myParticipation" => %{
                   "id" => ^id,
                   "email" => ^email
                 }
               }
             } = run_query(test_conn(), @my_participation_query, variables)
    end

    test "return an error on invalid participant token" do
      assert %{
               errors: [%{"message" => "unauthorized"}]
             } =
               run_query(test_conn(), @my_participation_query, %{token: "some random characters"})
    end
  end
end
