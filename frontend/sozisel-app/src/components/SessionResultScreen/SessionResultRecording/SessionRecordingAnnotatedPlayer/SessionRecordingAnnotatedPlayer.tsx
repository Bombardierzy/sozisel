import "./SessionRecordingAnnotatedPlayer.scss";

import { Annotation, AnnotationsPanel } from "./AnnotationsPanel";
import { AvTimer, Refresh, Share } from "@material-ui/icons";
import { Button, Snackbar, Tooltip } from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import {
  RecordingAnnotation,
  useDeleteSessionRecordingMutation,
  useResetSessionRecordingAnnotationsMutation,
  useUpdateSessionRecordingAnnotationsMutation,
} from "../../../../graphql";
import { UrlType, getUrl } from "../../../utils/Url/getUrl";

import { AUTO_HIDE_DURATION } from "../../../../common/consts";
import { Alert } from "@material-ui/lab";
import { DeleteResourcePopup } from "../../../utils/Popups/DeleteResourcePopup";
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
  const [videoDuration, setVideoDuration] = useState(0);

  const [openShareLink, setOpenShareLink] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [deleteRecordingMutation] = useDeleteSessionRecordingMutation({
    refetchQueries: ["GetRecordingBySession"],
  });

  const [updateRecordingAnnotations] =
    useUpdateSessionRecordingAnnotationsMutation();

  const [resetRecordingAnnotations] =
    useResetSessionRecordingAnnotationsMutation();

  const hideSnackbar = () => {
    setError(null);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.onerror = () => {
      setError("components.SessionRecordingAnnotatedPlayer.playerError");
    };

    videoRef.current.oncanplay = () => {
      setVideoDuration(videoRef.current?.duration || 0);
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

  const syncAnnotationsWithCurrentTimestamp = useCallback(() => {
    if (!videoRef.current) return;
    if (annotations.length === 0) return;

    const newOffset = Math.floor(videoRef.current.currentTime);
    const [first, ...remaining] = stripAnnotations(annotations);
    const oldOffset = first.timestamp;

    first.timestamp = newOffset;

    const annotationsWithOffset = [
      first,
      ...remaining.map((annotation) => ({
        ...annotation,
        timestamp: annotation.timestamp - oldOffset + newOffset,
      })),
    ];

    updateRecordingAnnotations({
      variables: {
        sessionRecordingId,
        annotations: annotationsWithOffset,
      },
    });
  }, [annotations, sessionRecordingId, updateRecordingAnnotations]);

  return (
    <>
      <div className="SessionRecordingAnnotatedPlayer">
        <div className="annotatedGrid">
          <video
            ref={videoRef}
            src={getUrl({
              type: UrlType.recording,
              id: `session_${sessionId}.mp4`,
            })}
            controls
          />
          <AnnotationsPanel
            duration={videoDuration}
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
          <Tooltip
            arrow
            placement="top"
            title={
              t(
                "components.SessionRecordingAnnotatedPlayer.syncAnnotationsTooltip"
              ) as string
            }
          >
            <Button
              variant="contained"
              classes={{
                contained: "actionButton reset",
                label: "actionButtonLabel",
              }}
              onClick={syncAnnotationsWithCurrentTimestamp}
            >
              {t("components.SessionRecordingAnnotatedPlayer.syncAnnotations")}
              <AvTimer />
            </Button>
          </Tooltip>
          <Tooltip
            arrow
            placement="top"
            title={
              t(
                "components.SessionRecordingAnnotatedPlayer.resetAnnotationsTooltip"
              ) as string
            }
          >
            <Button
              variant="contained"
              classes={{
                contained: "actionButton reset",
                label: "actionButtonLabel",
              }}
              onClick={() =>
                resetRecordingAnnotations({ variables: { sessionRecordingId } })
              }
            >
              {t("components.SessionRecordingAnnotatedPlayer.resetAnnotations")}
              <Refresh />
            </Button>
          </Tooltip>
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
        link={getUrl({
          type: UrlType.shareRecordingLink,
          id: sessionRecordingId,
        })}
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
