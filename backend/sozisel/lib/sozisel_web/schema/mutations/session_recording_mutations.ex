defmodule SoziselWeb.Schema.Mutations.SessionRecordingMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Sessions.Session
  alias Sozisel.Model.SessionRecordings.SessionRecording
  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionRecordingResolvers}

  object :session_recording_mutations do
    field :upload_session_recording, :string do
      arg :id, non_null(:id)
      arg :recording, non_null(:upload)

      middleware Middleware.ResourceAuthorization, {:upload_session_recording, Session}
      resolve &SessionRecordingResolvers.upload_recording/3
    end

    field :delete_session_recording, :string do
      @desc "Session's id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:upload_session_recording, Session}
      resolve &SessionRecordingResolvers.delete_recording/3
    end

    field :update_session_recording_annotations, :session_recording do
      @desc "SessionRecording's id"
      arg :id, non_null(:id)
      arg :annotations, strong_list_of(:recording_annotation_input)

      middleware Middleware.ResourceAuthorization, {:edit_session_recording, SessionRecording}
      resolve &SessionRecordingResolvers.update_recording_annotations/3
    end

    field :reset_session_recording_annotations, :session_recording do
      @desc "SessionRecording's id"
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:edit_session_recording, SessionRecording}
      resolve &SessionRecordingResolvers.reset_recording_annotations/3
    end
  end
end
