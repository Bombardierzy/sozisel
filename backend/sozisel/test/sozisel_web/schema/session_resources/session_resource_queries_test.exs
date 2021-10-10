defmodule SoziselWeb.Schema.SessionResources.SessionResourceQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @get_presenter_session_resources_query """
  query PresenterSessionResources($id: ID!) {
    presenterSessionResources(id: $id) {
      id
    }
  }
  """

  @get_participant_session_resources_query """
  query ParticipantSessionResources($id: ID!, $token: String!) {
    participantSessionResources(id: $id, token: $token) {
      id
      is_public
      sessionResource {
          id
          path
          filename
      }
    }
  }
  """

  describe "Session resource's query should" do
    setup do
      user1 = insert(:user)
      user2 = insert(:user)
      session1 = insert(:session)
      session2 = insert(:session)
      participant = insert(:participant)

      [
        conn: test_conn(user1),
        user1: user1,
        user2: user2,
        session1: session1,
        session2: session2,
        participant: participant
      ]
    end

    test "get all session_resources for presenter in session", ctx do
      session_resource_1 = insert(:session_resource, %{user_id: ctx.user1.id})
      session_resource_2 = insert(:session_resource, %{user_id: ctx.user1.id})
      session_resource_3 = insert(:session_resource, %{user_id: ctx.user2.id})

      insert(:session_resource_link, %{
        session_resource_id: session_resource_1.id,
        session_id: ctx.session1.id,
        is_public: false
      })

      insert(:session_resource_link, %{
        session_resource_id: session_resource_2.id,
        session_id: ctx.session1.id,
        is_public: true
      })

      insert(:session_resource_link, %{
        session_resource_id: session_resource_3.id,
        session_id: ctx.session2.id,
        is_public: true
      })

      assert %{
               data: %{
                 "presenterSessionResources" => session_resources
               }
             } =
               run_query(ctx.conn, @get_presenter_session_resources_query, %{id: ctx.session1.id})

      assert length(session_resources) == 2
    end

    test "get all session_resources for participant in session", ctx do
      session_resource_1 = insert(:session_resource, %{user_id: ctx.user1.id})
      session_resource_2 = insert(:session_resource, %{user_id: ctx.user2.id})

      session_resource_link =
        insert(:session_resource_link, %{
          session_resource_id: session_resource_1.id,
          session_id: ctx.session1.id,
          is_public: true
        })

      insert(:session_resource_link, %{
        session_resource_id: session_resource_2.id,
        session_id: ctx.session1.id,
        is_public: false
      })

      session_resource_link_id = session_resource_link.id

      session_resource_filename = session_resource_1.filename
      session_resource_id = session_resource_1.id
      session_resource_path = session_resource_1.path

      assert %{
               data: %{
                 "participantSessionResources" => [
                   %{
                     "id" => ^session_resource_link_id,
                     "is_public" => true,
                     "sessionResource" => %{
                       "filename" => ^session_resource_filename,
                       "id" => ^session_resource_id,
                       "path" => ^session_resource_path
                     }
                   }
                 ]
               }
             } =
               run_query(ctx.conn, @get_participant_session_resources_query, %{
                 id: ctx.session1.id,
                 token: ctx.participant.token
               })
    end
  end
end
