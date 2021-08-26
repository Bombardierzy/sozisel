import "./SessionRecordingAnnotatedPlayer.scss";

import { Annotation, AnnotationsPanel } from "./AnnotationsPanel";
import { Button, Snackbar } from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import {
  RecordingAnnotation,
  useDeleteSessionRecordingMutation,
  useUpdateSessionRecordingAnnotationsMutation,
} from "../../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../../common/consts";
import { Alert } from "@material-ui/lab";
import { DeleteResourcePopup } from "../../../utils/Popups/DeleteResourcePopup";
import { Share } from "@material-ui/icons";
import { ShareLinkPopup } from "../../../utils/Popups/ShareLinkPopup";
import omitDeep from "omit-deep-lodash";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

interface SessionRecordingAnnotatedPlayerProps {
  sessionId: string;
  sessionRecordingId: string;
  annotations: RecordingAnnotation[];
}

/**
 * Strips annotations from "__typename" hidden field.
 */
function stripAnnotations(annotations: RecordingAnnotation[]): Annotation[] {
  return annotations.map(
    (annotation) => omitDeep(annotation, "__typename") as Annotation
  );
}

export function SessionRecordingAnnotatedPlayer({
  sessionId,
  sessionRecordingId,
  annotations,
}: SessionRecordingAnnotatedPlayerProps): ReactElement {
  const { t } = useTranslation("common");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [openShareLink, setOpenShareLink] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [deleteRecordingMutation] = useDeleteSessionRecordingMutation({
    refetchQueries: ["SessionRecording"],
  });

  const [updateRecordingAnnotations] =
    useUpdateSessionRecordingAnnotationsMutation();

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

  const deleteAnnotation = useCallback(
    (annotationId: string) => {
      updateRecordingAnnotations({
        variables: {
          sessionRecordingId,
          annotations: stripAnnotations(annotations).filter(
            ({ id }) => id !== annotationId
          ),
        },
      });
    },
    [annotations, sessionRecordingId, updateRecordingAnnotations]
  );

  const addAnnotation = useCallback(
    (timestamp: number, label: string) => {
      updateRecordingAnnotations({
        variables: {
          sessionRecordingId,
          annotations: [
            ...stripAnnotations(annotations),
            { id: uuid(), timestamp: Math.floor(timestamp), label },
          ],
        },
      });
    },
    [annotations, sessionRecordingId, updateRecordingAnnotations]
  );

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
            annotations={annotations}
            onAnnotationCreate={addAnnotation}
            onAnnotationDelete={deleteAnnotation}
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
            onClick={() => setOpenDeleteDialog(true)}
          >
            {t("components.SessionRecordingAnnotatedPlayer.deleteRecording")}
          </Button>
          <Button
            variant="contained"
            classes={{
              contained: "actionButton share",
              label: "actionButtonLabel",
            }}
            onClick={() => setOpenShareLink(true)}
          >
            {t("components.SessionRecordingAnnotatedPlayer.shareRecording")}
            <Share />
          </Button>
        </div>
      </div>
      <ShareLinkPopup
        link={location.href}
        open={openShareLink}
        onClose={() => setOpenShareLink(false)}
        title={t("components.SessionRecordingAnnotatedPlayer.shareLinkTitle")}
        subtitle={t(
          "components.SessionRecordingAnnotatedPlayer.shareLinkSubtitle"
        )}
      />
      <DeleteResourcePopup
        open={openDeleteDialog}
        title={t("components.SessionRecordingAnnotatedPlayer.deleteRecording")}
        onCancel={() => setOpenDeleteDialog(false)}
        onDelete={() => {
          deleteRecordingMutation({ variables: { sessionId } });
          setOpenDeleteDialog(false);
        }}
      />
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
