import "./SessionRecordingAnnotatedPlayer.scss";

import { Button, Snackbar } from "@material-ui/core";
import { ReactElement, useEffect, useRef, useState } from "react";

import { AUTO_HIDE_DURATION } from "../../../../common/consts";
import { Alert } from "@material-ui/lab";
import { AnnotationsPanel } from "./AnnotationsPanel";
import { Share } from "@material-ui/icons";
import { useDeleteSessionRecordingMutation } from "../../../../graphql";
import { useTranslation } from "react-i18next";

interface SessionRecordingAnnotatedPlayerProps {
  sessionId: string;
}

export function SessionRecordingAnnotatedPlayer({
  sessionId,
}: SessionRecordingAnnotatedPlayerProps): ReactElement {
  const { t } = useTranslation("common");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [deleteRecordingMuation] = useDeleteSessionRecordingMutation({
    refetchQueries: ["SessionRecording"],
  });

  const hideSnackbar = () => {
    setError(null);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.onerror = () => {
      setError("components.SessionRecordingAnnotatedPlayer.playerError");
    };
  }, []);

  return (
    <>
      <div className="SessionRecordingAnnotatedPlayer">
        <div className="annotatedGrid">
          <video
            ref={videoRef}
            src={`http://localhost:4000/recording/session_${sessionId}.mp4`}
            controls
          />
          <AnnotationsPanel />
        </div>

        <div className="actionButtons">
          <Button
            variant="contained"
            classes={{
              contained: "actionButton delete",
              label: "actionButtonLabel",
            }}
            onClick={() =>
              deleteRecordingMuation({ variables: { sessionId: sessionId } })
            }
          >
            {t("components.SessionRecordingAnnotatedPlayer.deleteRecording")}
          </Button>
          <Button
            variant="contained"
            classes={{
              contained: "actionButton share",
              label: "actionButtonLabel",
            }}
          >
            {t("components.SessionRecordingAnnotatedPlayer.shareRecording")}
            <Share />
          </Button>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={error != null}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={hideSnackbar}
      >
        <Alert onClose={hideSnackbar} severity="error">
          {error && t(error)}
        </Alert>
      </Snackbar>
    </>
  );
}
