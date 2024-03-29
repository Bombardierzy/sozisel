import "./SessionRecordingAnnotatedPlayer.scss";

import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { UrlType, getTypedUrl } from "../../../utils/Urls/urls";

import { AnnotationsPanel } from "./AnnotationsPanel";
import Navbar from "../../../Navbar/LoginNavbar/Navbar";
import { useParams } from "react-router";
import { useSessionRecordingQuery } from "../../../../graphql";

export function SessionRecordingPublicPlayer(): ReactElement {
  const { id: recordingId } = useParams<{ id: string }>();

  return <Player recordingId={recordingId} />;
}

interface PlayerProps {
  recordingId: string;
}
function Player({ recordingId }: PlayerProps): ReactElement {
  const { data, loading, error } = useSessionRecordingQuery({
    variables: { id: recordingId },
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const onSeek = useCallback((timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
  }, []);

  useEffect(() => {
    if (!error && !loading && videoRef.current) {
      videoRef.current.oncanplay = () => {
        setDuration(videoRef.current?.duration || 0);
      };
    }
  }, [error, loading]);

  if (data?.sessionRecording)
    return (
      <div>
        <Navbar includeLogin={false} />
        <div className="SessionRecordingAnnotatedPlayer">
          <div className="annotatedGrid">
            <video
              ref={videoRef}
              src={getTypedUrl({
                type: UrlType.recording,
                // FIX_ME make necessary changes on backend side and remove this ugly splits
                id: data.sessionRecording.path.split("_")[1].split(".")[0],
              })}
              controls
            />
            <AnnotationsPanel
              readonly
              duration={duration}
              annotations={data.sessionRecording.annotations}
              onAnnotationCreate={() => ({})}
              onAnnotationDelete={() => ({})}
              onSeek={onSeek}
              currentPlayerTimestamp={() => 0}
            />
          </div>
        </div>
      </div>
    );

  return <></>;
}
