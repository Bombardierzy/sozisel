import "./SessionRecordingUpload.scss";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { VideoLabel, VideoLibrary } from "@material-ui/icons";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";
import { useTranslation } from "react-i18next";
import { useUploadSessionRecordingMutation } from "../../../graphql";

interface SessionRecordingUploadProps {
  sessionId: string;
}

export default function SessionRecordingUpload({
  sessionId,
}: SessionRecordingUploadProps): ReactElement {
  const { t } = useTranslation("common");

  const [file, setFile] = useState<File | undefined>();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<
    { message: string; severity: "error" | "success" } | undefined
  >();

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const abortUpload = useRef<() => void | null>();

  const [uploadSessionRecording, { loading, data, error }] =
    useUploadSessionRecordingMutation({
      refetchQueries: ["SessionRecording"],
      context: {
        fetchOptions: {
          useUpload: true,
          onUploadProgress: (progress: number) => {
            setUploadProgress(progress);
          },
          onAbortPossible: (onAbort: () => void) => {
            abortUpload.current = onAbort;
          },
        },
      },
    });

  const onFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDialogClose = useCallback(() => {
    setDialogOpened(false);
    if (abortUpload.current) {
      abortUpload.current();
    }
  }, [setDialogOpened]);

  const hideSnackbar = useCallback(() => {
    setSnackbar(undefined);
  }, [setSnackbar]);

  useEffect(() => {
    if (data) {
      setSnackbar({
        message: t("components.SessionRecordingUpload.uploadSuccessful"),
        severity: "success",
      });
      setDialogOpened(false);
    }
    if (error) {
      setSnackbar({
        message: t("components.SessionRecordingUpload.uploadFailed"),
        severity: "error",
      });
    }
  }, [data, error, t, setSnackbar, setDialogOpened]);

  useEffect(() => {
    if (!dialogOpened) {
      setFile(undefined);
    }
  }, [dialogOpened]);

  const handleSubmit = () => {
    uploadSessionRecording({
      variables: {
        sessionId: sessionId,
        recording: file,
      },
    });
  };

  return (
    <div className="SessionRecordingUpload">
      <div className="placeholder" onClick={() => setDialogOpened(true)}>
        <VideoLibrary />
        <Typography variant="h5" className="text">
          {t("components.SessionRecordingUpload.dialogTitle")}
        </Typography>
      </div>

      <Dialog
        className="SessionRecordingPopup"
        open={dialogOpened}
        onClose={handleDialogClose}
      >
        <Typography variant="h6" className="poppinsBoldText">
          {t("components.SessionRecordingUpload.dialogTitle")}
        </Typography>
        {/* <DialogTitle classes={{root: "poppinsBoldText"}}>
        </DialogTitle> */}
        <DialogContent>
          <DropzoneArea
            classes={{
              textContainer: "textContainer",
              text: "poppinsBoldText",
              icon: "dropzoneIcon",
            }}
            previewGridClasses={{
              container: "previewContainer",
            }}
            getPreviewIcon={() => <VideoLabel />}
            filesLimit={1}
            showFileNames
            // allow up to 300MB files
            maxFileSize={3000 * 1000 * 1000}
            acceptedFiles={["video/mp4"]}
            dropzoneText={t("components.SessionRecordingUpload.dropzoneText")}
            showAlerts={false}
            getFileAddedMessage={() =>
              t("components.SessionRecordingUpload.addedFile")
            }
            getFileRemovedMessage={() =>
              t("components.SessionRecordingUpload.removedFile")
            }
            onChange={onFilesChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {t("components.SessionRecordingUpload.cancelText")}
          </Button>
          <Button
            disabled={!file || loading}
            onClick={handleSubmit}
            color="primary"
          >
            {!loading && t("components.SessionRecordingUpload.submitText")}
            {loading && t("components.SessionRecordingUpload.uploadingText")}
          </Button>

          {loading && (
            <Typography variant="body2" color="textSecondary">{`${Math.round(
              uploadProgress
            )}%`}</Typography>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={!!snackbar}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={hideSnackbar}
      >
        {snackbar && (
          <Alert onClose={hideSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
}
