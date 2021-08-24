import "./SessionRecordingUpload.scss";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useState } from "react";
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

  const [uploadSessionRecording, { loading, data, error }] =
    useUploadSessionRecordingMutation({ refetchQueries: ["SessionRecording"] });

  const onFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDialogClose = useCallback(() => {
    setDialogOpened(false);
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
        onClose={() => setDialogOpened(false)}
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
          <Button disabled={!file} onClick={handleSubmit} color="primary">
            {loading && <CircularProgress />}
            {t("components.SessionRecordingUpload.submitText")}
          </Button>
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
