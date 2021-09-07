defmodule SoziselWeb.Schema.SessionRecordingMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory
  
  alias Sozisel.MediaStorage.Disk

  @upload_recording_mutation """
  mutation UploadRecording($id: ID!, $recording: Upload!) {
    uploadMessage: uploadSessionRecording(id: $id, recording: $recording)
  }
  """
  @delete_recording_mutation """
  mutation DeleteSessionRecording($id: ID!) {
    deleteMessage: deleteSessionRecording(id: $id)
  }
  """

  @update_recording_annotations_mutation """
  mutation UpdateSessionRecordingAnnotations($id: ID!, $annotations: [RecordingAnnotationInput!]!) {
    updateSessionRecordingAnnotations(id: $id, annotations: $annotations) {
      id
      annotations {
        id
        timestamp
        label
      }
    }
  }
  """

  describe "Session recording mutations should" do
    setup do
      user = insert(:user)

      template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: template.id, user_id: user.id)

      File.copy!("test/assets/test_recording.mp4", "/tmp/test_recording.mp4")

      upload = %Plug.Upload{
        content_type: "video/mp4",
        path: "/tmp/test_recording.mp4",
        filename: "session_recording.mp4"
      }

      [conn: test_conn(user), session: session, user: user, upload: upload]
    end

    test "upload a session recording", ctx do
      assert %{
               "data" => %{
                 "uploadMessage" => "recording has been uploaded"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_recording_mutation,
                 variables: %{id: ctx.session.id, recording: "recording"},
                 recording: ctx.upload
               )
               |> json_response(200)

      assert Disk.file_exists?("session_#{ctx.session.id}.mp4")
    end
    #      session_9c624b4f-9592-4f3b-8b5e-65441da299cf.mp4
    # /tmp/session_9c624b4f-9592-4f3b-8b5e-65441da299cf.mp4

    test "forbid from uploading a session recording twice for the same session", ctx do
      assert %{
               "data" => %{
                 "uploadMessage" => "recording has been uploaded"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_recording_mutation,
                 variables: %{id: ctx.session.id, recording: "recording"},
                 recording: ctx.upload
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "uploadMessage" => nil
               },
               "errors" => [
                 %{
                   "message" => "session_id a recording for given session already exists"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_recording_mutation,
                 variables: %{id: ctx.session.id, recording: "recording"},
                 recording: ctx.upload
               )
               |> json_response(200)
    end

    test "delete session's recording", ctx do
      File.copy!("test/assets/test_recording.mp4", "/tmp/test_recording.mp4")

      upload = %Plug.Upload{
        content_type: "video/mp4",
        path: "/tmp/test_recording.mp4",
        filename: "session_recording.mp4"
      }

      assert %{
               "data" => %{
                 "uploadMessage" => "recording has been uploaded"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @upload_recording_mutation,
                 variables: %{id: ctx.session.id, recording: "recording"},
                 recording: upload
               )
               |> json_response(200)

      assert %{
               "data" => %{
                 "deleteMessage" => "recording has been deleted"
               }
             } =
               ctx.conn
               |> post("/api/",
                 query: @delete_recording_mutation,
                 variables: %{id: ctx.session.id}
               )
               |> json_response(200)
    end

    test "return an error when trying to delete non-existent recording", ctx do
      assert %{
               "data" => %{
                 "deleteMessage" => nil
               },
               "errors" => [
                 %{
                   "message" => "recording does not exist"
                 }
               ]
             } =
               ctx.conn
               |> post("/api/",
                 query: @delete_recording_mutation,
                 variables: %{id: ctx.session.id}
               )
               |> json_response(200)
    end

    test "update recording's annotations", ctx do
      alias Sozisel.Model.SessionRecordings

      {:ok, %{id: recording_id}} =
        SessionRecordings.create_session_recording(%{
          session_id: ctx.session.id,
          path: "/"
        })

      annotations = [
        %{id: Ecto.UUID.generate(), timestamp: 10, label: "first label"},
        %{id: Ecto.UUID.generate(), timestamp: 15, label: "second label"}
      ]

      assert %{
               data: %{
                 "updateSessionRecordingAnnotations" => %{
                   "id" => ^recording_id,
                   "annotations" => [
                     %{"id" => _, "timestamp" => 10, "label" => "first label"},
                     %{"id" => _, "timestamp" => 15, "label" => "second label"}
                   ]
                 }
               }
             } =
               run_query(ctx.conn, @update_recording_annotations_mutation, %{
                 id: recording_id,
                 annotations: annotations
               })

      assert %{
               data: %{
                 "updateSessionRecordingAnnotations" => %{
                   "id" => ^recording_id,
                   "annotations" => []
                 }
               }
             } =
               run_query(ctx.conn, @update_recording_annotations_mutation, %{
                 id: recording_id,
                 annotations: []
               })
    end
  end
end
