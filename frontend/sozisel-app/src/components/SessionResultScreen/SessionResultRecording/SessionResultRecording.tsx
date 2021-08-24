import { Button, CircularProgress } from "@material-ui/core";
import {
  useDeleteSessionRecordingMutation,
  useSessionRecordingQuery,
} from "../../../graphql";

import { ReactElement } from "react";
import SessionRecordingUpload from "./SesisonRecordingUpload";

interface SessionResultRecordingProps {
  sessionId: string;
}

export function SessionResultRecording({
  sessionId,
}: SessionResultRecordingProps): ReactElement {
  const { data, loading, error } = useSessionRecordingQuery({
    variables: { id: sessionId },
  });

  // TODO: remove this, its just for quick recording delete
  //
  const [deleteRecordingMuation] = useDeleteSessionRecordingMutation({
    refetchQueries: ["SessionRecording"],
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (!data?.session?.sessionRecording) {
    return <SessionRecordingUpload sessionId={sessionId} />;
  }

  return (
    <>
      <Button
        onClick={() =>
          deleteRecordingMuation({ variables: { sessionId: sessionId } })
        }
      >
        BOOOOOM
      </Button>
    </>
  );
}
