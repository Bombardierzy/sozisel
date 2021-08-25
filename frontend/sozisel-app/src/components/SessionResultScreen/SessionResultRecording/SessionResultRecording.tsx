import { ReactElement, useMemo } from "react";

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
  const { data, loading } = useSessionRecordingQuery({
    variables: { id: sessionId },
  });

  const hasRecording = useMemo(() => {
    return data?.session?.sessionRecording !== undefined;
  }, [data?.session?.sessionRecording]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!hasRecording) {
    return <SessionRecordingUpload sessionId={sessionId} />;
  }

  return <SessionRecordingAnnotatedPlayer sessionId={sessionId} />;
}
