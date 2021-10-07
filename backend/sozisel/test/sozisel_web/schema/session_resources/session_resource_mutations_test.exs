defmodule SoziselWeb.Schema.SessionResources.SessionResourceMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.MediaStorage.Disk
  alias Sozisel.Model.{SessionResources, SessionResourceLinks}
  alias SessionResources.SessionResource

  @upload_session_resource_mutation """
  mutation UploadSessionResource($resource: Upload!) {
    uploadMessage: uploadSessionResource(resource: $resource)
  }
  """

  @delete_session_resource_mutation """
  mutation DeleteSessionResource($id: ID!) {
    deleteMessage: deleteSessionResource(id: $id)
  }
  """

  @attach_resource_to_session_mutation """
  mutation AttachResourceToSession($input: SessionResourceLinkInput!) {
    attachResourceToSession(input: $input) {
      id
      is_public
    }
  }
  """

  @change_access_session_resource_link_mutation """
  mutation ChangeAccessSessionResourceLink($id: ID!) {
    changeAccessMessage: changeAccessSessionResourceLink(id: $id)
  }
  """

  @detach_resource_from_session_mutation """
  mutation DetachResourceFromSession($id: ID!) {
    detachMessage: detachResourceFromSession(id: $id)
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
                 "uploadMessage" => "Session resource has been uploaded successfully"
               }
             } =
               ctx.conn
               |> post("/api/",
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
                 "uploadMessage" => "Session resource has been uploaded successfully"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_session_resource_mutation,
                 variables: %{resource: "resource"},
                 resource: ctx.upload
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "uploadMessage" => nil
               },
               "errors" => [
                 %{
                   "message" => "path a resource for given name already exists"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_session_resource_mutation,
                 variables: %{resource: "resource"},
                 resource: ctx.upload
               )
               |> json_response(200)
    end

    test "delete session's recording", ctx do
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
                 "deleteMessage" => "Session resource has been deleted successfully"
               }
             } =
               ctx.conn
               |> post("/api/",
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
                 "deleteMessage" => "Session resource has been deleted successfully"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @delete_session_resource_mutation,
                 variables: %{id: session_resource.id}
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "deleteMessage" => nil
               },
               "errors" => [
                 %{
                   "message" => "session resource does not exist"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/",
                 query: @delete_session_resource_mutation,
                 variables: %{id: session_resource.id}
               )
               |> json_response(200)
    end

    test "attach a session resources to session", ctx do
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
                 "attachResourceToSession" => %{
                   "id" => _,
                   "is_public" => true
                 }
               }
             } =
               ctx.conn
               |> post("/api/",
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

    test "change session resource access", ctx do
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
                 "attachResourceToSession" => %{
                   "id" => id,
                   "is_public" => true
                 }
               }
             } =
               ctx.conn
               |> post("/api/",
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
                 "changeAccessMessage" => "Access has been successfully changed"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @change_access_session_resource_link_mutation,
                 variables: %{id: id}
               )
               |> json_response(200)

      session_resource_link = SessionResourceLinks.get_session_resource_link!(id)

      assert session_resource_link.is_public == false
    end

    test "detach a session resources from session", ctx do
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
                 "attachResourceToSession" => %{
                   "id" => id
                 }
               }
             } =
               ctx.conn
               |> post("/api/",
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
                 "detachMessage" =>
                   "Session resource link has been saccessfully deleted from session"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @detach_resource_from_session_mutation,
                 variables: %{id: id}
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
  end
end
