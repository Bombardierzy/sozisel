import "./SessionRecordingAnnotatedPlayer.scss";

import { Button, Snackbar } from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

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

  const seekPlayer = useCallback((timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
  }, []);

  const currentPlayerTimestamp = useCallback(() => {
    if (!videoRef.current) return 0;

    return videoRef.current.currentTime;
  }, []);

  const [rows, setRows] = useState([
    { id: "1", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "2", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "3", timestamp: 250, label: "Kolejna aferka" },
    { id: "4", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "5", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "6", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "7", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "8", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "9", timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { id: "10", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "11", timestamp: 250, label: "Kolejna aferka" },
    { id: "12", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "13", timestamp: 250, label: "Kolejna aferka" },
    { id: "14", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "15", timestamp: 250, label: "Kolejna aferka" },
    { id: "16", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "17", timestamp: 250, label: "Kolejna aferka" },
    { id: "18", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "19", timestamp: 250, label: "Kolejna aferka" },
    { id: "20", timestamp: 120, label: "Racja musi być po mojej stronie" },
    { id: "21", timestamp: 250, label: "Kolejna aferka" },
  ]);

  const deleteRow = useCallback((rowId: string) => {
    setRows((rows) => rows.filter(({ id }) => rowId != id));
  }, []);

  const addRow = useCallback((timestamp: number, label: string) => {
    const id = `${Math.random()}`;
    setRows((rows) => [...rows, { id, timestamp, label }]);
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
          <AnnotationsPanel
            annotations={rows}
            onAnnotationCreate={addRow}
            onAnnotationDelete={deleteRow}
            onSeek={seekPlayer}
            currentPlayerTimestamp={currentPlayerTimestamp}
          />
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
