import { ReactElement, useMemo } from "react";

import { CircularProgress } from "@material-ui/core";
import { SessionRecordingAnnotatedPlayer } from "./SessionRecordingAnnotatedPlayer/SessionRecordingAnnotatedPlayer";
import SessionRecordingUpload from "./SesisonRecordingUpload";
import { VideoJsPlayerOptions } from "video.js";
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

  const playerOptions = useMemo(() => {
    if (!data?.session?.sessionRecording) return undefined;

    const videoJsOptions: VideoJsPlayerOptions = {
      // lookup the options in the docs for more options
      autoplay: true,
      controls: true,
      sources: [
        {
          src: `http://localhost:4000/recording/session_${sessionId}.mp4`,
          type: "video/mp4",
        },
      ],
    };

    return videoJsOptions;
  }, [data?.session?.sessionRecording, sessionId]);

  // TODO: remove this, its just for quick recording delete
  //

  if (loading) {
    return <CircularProgress />;
  }

  if (!data?.session?.sessionRecording) {
    return <SessionRecordingUpload sessionId={sessionId} />;
  }

  if (playerOptions) {
    return <SessionRecordingAnnotatedPlayer sessionId={sessionId} />;
  }

  return <>BOOOOOM</>;
}
