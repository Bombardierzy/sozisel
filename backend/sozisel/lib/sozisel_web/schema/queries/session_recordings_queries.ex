defmodule SoziselWeb.Schema.Queries.SessionRecordingQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.SessionRecordingResolvers

  object :session_recording_queries do
    # it is ok to expose session recording as the query's user
    # has to know UUID which can be shared to the public
    # by the recording's owner so don't protect it
    field :session_recording, :session_recording do
      arg :id, non_null(:id)

      resolve &SessionRecordingResolvers.get_session_recording/3
    end
  end
end
