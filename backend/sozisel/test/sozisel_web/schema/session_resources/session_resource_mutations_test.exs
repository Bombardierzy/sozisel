defmodule SoziselWeb.Schema.SessionResources.SessionResourceMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.MediaStorage.Disk
  alias Sozisel.Model.{SessionResources, SessionResourceLinks}
  alias SessionResources.SessionResource

  @upload_session_resource_mutation """
  mutation UploadSessionResource($resource: Upload!) {
    uploadSessionResource(resource: $resource) {
        id
        path
        filename
    }
  }
  """

  @delete_session_resource_mutation """
  mutation DeleteSessionResource($id: ID!) {
    deleteSessionResource(id: $id) {
        id
        path
        filename
    }
  }
  """

  @attach_resource_to_session_mutation """
  mutation AttachResourceToSession($input: SessionResourceLinkInput!) {
    attachResourceToSession(input: $input) {
      id
      isPublic
      sessionResource {
          id
          path
          filename
      }
    }
  }
  """

  @change_access_session_resource_link_mutation """
  mutation ChangeAccessSessionResourceLink($id: ID!, $is_public: Boolean) {
    changeAccessSessionResourceLink(id: $id, is_public: $is_public) {
      id
      isPublic
      sessionResource {
          id
          path
          filename
      }
    }
  }
  """

  @detach_resource_from_session_mutation """
  mutation DetachResourceSessionLink($id: ID!) {
    detachResourceSessionLink(id: $id) {
      id
      isPublic
      sessionResource {
          id
          path
          filename
      }
    }
  }
  """

  describe "Session resource mutations should" do
    setup do
      user = insert(:user)
      session = insert(:session)

      File.copy!("test/assets/test_session_resource.pdf", "/tmp/test_session_resource.pdf")

      upload = %Plug.Upload{
        content_type: "application/pdf",
        path: "/tmp/test_session_resource.pdf",
        filename: "session_resource.pdf"
      }

      filename = "session_resource.pdf"

      [conn: test_conn(user), user: user, session: session, upload: upload, filename: filename]
    end

    test "upload a session resource", ctx do
      assert %{
               "data" => %{
                 "uploadSessionResource" => %{
                   "filename" => "session_resource.pdf",
                   "id" => _,
                   "path" => _
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @upload_session_resource_mutation,
                 variables: %{resource: "resource"},
                 resource: ctx.upload
               )
               |> json_response(200)

      assert SessionResource.generate_filename(ctx.user.id, ctx.filename)
             |> Disk.file_exists?()
    end

    test "forbid from uploading a session resource with the same name", ctx do
      assert %{
               "data" => %{
                 "uploadSessionResource" => _
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @upload_session_resource_mutation,
                 variables: %{resource: "resource"},
                 resource: ctx.upload
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "uploadSessionResource" => nil
               },
               "errors" => [
                 %{
                   "message" => "path resource with given path already exists"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @upload_session_resource_mutation,
                 variables: %{resource: "resource"},
                 resource: ctx.upload
               )
               |> json_response(200)
    end

    test "delete session's recording", ctx do
      assert {:ok, %SessionResource{id: session_resource_id} = session_resource} =
               SessionResources.create_session_resource(
                 %{
                   path: "some path",
                   filename: "some filename"
                 }
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert %{
               "data" => %{
                 "deleteSessionResource" => %{
                   "filename" => "some filename",
                   "id" => ^session_resource_id,
                   "path" => "some path"
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @delete_session_resource_mutation,
                 variables: %{id: session_resource.id}
               )
               |> json_response(200)
    end

    test "return an error when trying to delete non-existent recording", ctx do
      assert {:ok, %SessionResource{} = session_resource} =
               SessionResources.create_session_resource(
                 %{
                   path: "some path",
                   filename: "some filename"
                 }
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert %{
               "data" => %{
                 "deleteSessionResource" => _
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @delete_session_resource_mutation,
                 variables: %{id: session_resource.id}
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "deleteSessionResource" => nil
               },
               "errors" => [
                 %{
                   "message" => "unauthorized"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @delete_session_resource_mutation,
                 variables: %{id: session_resource.id}
               )
               |> json_response(200)
    end

    test "attach a session resources to session", ctx do
      assert {:ok, %SessionResource{id: session_resource_id} = session_resource} =
               SessionResources.create_session_resource(
                 %{
                   path: "some path",
                   filename: "some filename"
                 }
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert %{
               "data" => %{
                 "attachResourceToSession" => %{
                   "id" => _,
                   "isPublic" => true,
                   "sessionResource" => %{
                     "filename" => "some filename",
                     "id" => ^session_resource_id,
                     "path" => "some path"
                   }
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @attach_resource_to_session_mutation,
                 variables: %{
                   input: %{
                     resourceId: session_resource.id,
                     sessionId: ctx.session.id,
                     is_public: true
                   }
                 }
               )
               |> json_response(200)

      session =
        ctx.session
        |> Repo.preload(:session_resource_links)

      session_resource =
        session_resource
        |> Repo.preload(:session_resource_links)

      assert length(session.session_resource_links) == 1
      assert length(session_resource.session_resource_links) == 1
    end

    test "detach a session resources from session", ctx do
      assert {:ok, %SessionResource{id: session_resource_id} = session_resource} =
               SessionResources.create_session_resource(
                 %{
                   path: "some path",
                   filename: "some filename"
                 }
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert %{
               "data" => %{
                 "attachResourceToSession" => %{
                   "id" => session_resource_link_id
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @attach_resource_to_session_mutation,
                 variables: %{
                   input: %{
                     resourceId: session_resource.id,
                     sessionId: ctx.session.id,
                     is_public: true
                   }
                 }
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "detachResourceSessionLink" => %{
                   "id" => ^session_resource_link_id,
                   "isPublic" => true,
                   "sessionResource" => %{
                     "filename" => "some filename",
                     "id" => ^session_resource_id,
                     "path" => "some path"
                   }
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @detach_resource_from_session_mutation,
                 variables: %{id: session_resource_link_id}
               )
               |> json_response(200)

      session =
        ctx.session
        |> Repo.preload(:session_resource_links)

      session_resource =
        session_resource
        |> Repo.preload(:session_resource_links)

      assert length(session.session_resource_links) == 0
      assert length(session_resource.session_resource_links) == 0
    end

    test "change session resource access", ctx do
      assert {:ok, %SessionResource{id: session_resource_id} = session_resource} =
               SessionResources.create_session_resource(
                 %{
                   path: "some path",
                   filename: "some filename"
                 }
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert %{
               "data" => %{
                 "attachResourceToSession" => %{
                   "id" => session_resource_link_id,
                   "isPublic" => true
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @attach_resource_to_session_mutation,
                 variables: %{
                   input: %{
                     resourceId: session_resource.id,
                     sessionId: ctx.session.id,
                     is_public: true
                   }
                 }
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "changeAccessSessionResourceLink" => %{
                   "id" => ^session_resource_link_id,
                   "isPublic" => false,
                   "sessionResource" => %{
                     "filename" => "some filename",
                     "id" => ^session_resource_id,
                     "path" => "some path"
                   }
                 }
               }
             } =
               ctx.conn
               |> post("/api/graphql/",
                 query: @change_access_session_resource_link_mutation,
                 variables: %{id: session_resource_link_id, is_public: false}
               )
               |> json_response(200)

      session_resource_link =
        SessionResourceLinks.get_session_resource_link!(session_resource_link_id)

      assert session_resource_link.is_public == false
    end
  end
end
