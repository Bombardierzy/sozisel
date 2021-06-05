defmodule SoziselWeb.Schema.SessionRecordingMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @upload_recording_mutation """
  mutation UploadRecording($id: ID!, $recording: Upload!) {
    uploadMessage: uploadSessionRecording(id: $id, recording: $recording)
  }
  """

  describe "Session recording mutations should" do
    setup do
      user = insert(:user)

      template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: template.id, user_id: user.id)

      [conn: test_conn(user), session: session, user: user]
    end

    test "upload a session recording", ctx do
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
    end
  end
end
