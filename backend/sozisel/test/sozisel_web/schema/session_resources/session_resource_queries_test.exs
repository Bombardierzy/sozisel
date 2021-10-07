defmodule SoziselWeb.Schema.SessionResources.SessionResourceQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @get_files_query """
  query Files {
    files {
      id
      filename
    }
  }
  """

  @get_session_resources_presenter_query """
  query SessionResourcesPresenter($id: ID!) {
    sessionResourcesPresenter(id: $id) {
      id
      is_public
      filename
    }
  }
  """

  @get_session_resources_participant_query """
  query SessionResourcesParticipant($id: ID!, $token: String!) {
    sessionResourcesParticipant(id: $id, token: $token) {
      id
      filename
    }
  }
  """

  @download_session_resource_presenter_query """
  query DownloadSessionResourcePresenter($id: ID!) {
    downloadSessionResourcePresenter(id: $id) {
      id
      path
    }
  }
  """

  @download_session_resource_participant_query """
  query DownloadSessionResourceParticipant($id: ID!, $token: String!) {
    downloadSessionResourceParticipant(id: $id, token: $token) {
      id
      path
    }
  }
  """

  describe "Session resource's query should" do
    setup do
      u1 = insert(:user)
      u2 = insert(:user)
      session = insert(:session)
      participant = insert(:participant)
      [conn: test_conn(u1), u1: u1, u2: u2, session: session, participant: participant]
    end

    test "get all files for presenter", ctx do
      sr = insert(:session_resource, %{user_id: ctx.u1.id})
      insert(:session_resource, %{user_id: ctx.u2.id})
      insert(:session_resource, %{user_id: ctx.u2.id})

      sr_filename = sr.filename
      sr_id = sr.id

      assert %{
               data: %{
                 "files" => [
                   %{
                     "filename" => ^sr_filename,
                     "id" => ^sr_id
                   }
                 ]
               }
             } = run_query(ctx.conn, @get_files_query, %{})

      assert %{
               data: %{
                 "files" => files
               }
             } = run_query(test_conn(ctx.u2), @get_files_query, %{})

      assert length(files) == 2
    end

    test "get all session_resources for presenter in session", ctx do
      sr1 = insert(:session_resource, %{user_id: ctx.u1.id})
      sr2 = insert(:session_resource, %{user_id: ctx.u2.id})

      insert(:session_resource_link, %{
        session_resource_id: sr1.id,
        session_id: ctx.session.id,
        is_public: false
      })

      insert(:session_resource_link, %{
        session_resource_id: sr2.id,
        session_id: ctx.session.id,
        is_public: true
      })

      assert %{
               data: %{
                 "sessionResourcesPresenter" => files
               }
             } =
               run_query(ctx.conn, @get_session_resources_presenter_query, %{id: ctx.session.id})

      assert length(files) == 2
    end

    test "get all session_resources for participant in session", ctx do
      sr1 = insert(:session_resource, %{user_id: ctx.u1.id})
      sr2 = insert(:session_resource, %{user_id: ctx.u2.id})

      srl =
        insert(:session_resource_link, %{
          session_resource_id: sr1.id,
          session_id: ctx.session.id,
          is_public: true
        })

      insert(:session_resource_link, %{
        session_resource_id: sr2.id,
        session_id: ctx.session.id,
        is_public: false
      })

      srl_filename = sr1.filename
      srl_id = srl.id

      assert %{
               data: %{
                 "sessionResourcesParticipant" => [
                   %{
                     "filename" => ^srl_filename,
                     "id" => ^srl_id
                   }
                 ]
               }
             } =
               run_query(ctx.conn, @get_session_resources_participant_query, %{
                 id: ctx.session.id,
                 token: ctx.participant.token
               })
    end

    test "download file by presenter", ctx do
      sr = insert(:session_resource, %{user_id: ctx.u1.id})

      sr_path = sr.path
      sr_id = sr.id

      assert %{
               data: %{
                 "downloadSessionResourcePresenter" => %{
                   "path" => ^sr_path,
                   "id" => ^sr_id
                 }
               }
             } = run_query(ctx.conn, @download_session_resource_presenter_query, %{id: sr_id})
    end

    test "forbid to download file for other user", ctx do
      sr = insert(:session_resource, %{user_id: ctx.u1.id})

      assert %{
               errors: [
                 %{
                   "message" => "unauthorized"
                 }
               ]
             } =
               run_query(test_conn(ctx.u2), @download_session_resource_presenter_query, %{
                 id: sr.id
               })
    end

    test "download public file by participant", ctx do
      sr = insert(:session_resource, %{user_id: ctx.u1.id})
      srl = insert(:session_resource_link, %{session_resource_id: sr.id, is_public: true})

      participant = insert(:participant)

      sr_path = sr.path
      sr_id = sr.id

      assert %{
               data: %{
                 "downloadSessionResourceParticipant" => %{
                   "path" => ^sr_path,
                   "id" => ^sr_id
                 }
               }
             } =
               run_query(ctx.conn, @download_session_resource_participant_query, %{
                 id: srl.id,
                 token: participant.token
               })
    end

    test "forbid download private file by participant", ctx do
      sr = insert(:session_resource, %{user_id: ctx.u1.id})
      srl = insert(:session_resource_link, %{session_resource_id: sr.id, is_public: false})

      participant = insert(:participant)

      assert %{
               data: %{
                 "downloadSessionResourceParticipant" => nil
               }
             } =
               run_query(ctx.conn, @download_session_resource_participant_query, %{
                 id: srl.id,
                 token: participant.token
               })
    end
  end
end
