import { ReactElement, useEffect } from "react";

import { CircularProgress } from "@material-ui/core";
import { SessionRecordingAnnotatedPlayer } from "./SessionRecordingAnnotatedPlayer/SessionRecordingAnnotatedPlayer";
import SessionRecordingUpload from "./SessionRecordingUpload";
import { useSessionRecordingQuery } from "../../../graphql";

interface SessionResultRecordingProps {
  sessionId: string;
}

export function SessionResultRecording({
  sessionId,
}: SessionResultRecordingProps): ReactElement {
  const { data, loading, error } = useSessionRecordingQuery({
    variables: { id: sessionId },
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <></>;
  }

  if (data?.session?.sessionRecording) {
    return (
      <SessionRecordingAnnotatedPlayer
        sessionId={sessionId}
        sessionRecordingId={data.session.sessionRecording.id}
        annotations={data.session.sessionRecording.annotations}
      />
    );
  }

  return <SessionRecordingUpload sessionId={sessionId} />;
}
