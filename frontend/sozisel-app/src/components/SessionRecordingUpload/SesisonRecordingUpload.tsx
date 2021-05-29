import { ReactElement, useEffect, useState } from "react";

import { Button } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUploadSessionRecordingMutation } from "../../graphql";

export default function SessionRecordingUpload(): ReactElement {
  const { id: sessionId } = useParams<{ id: string }>();

  const { t } = useTranslation("common");

  const [file, setFile] = useState<File | undefined>();

  const [
    uploadSessionRecording,
    { loading, data, error },
  ] = useUploadSessionRecordingMutation();

  const onFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  useEffect(() => {
    console.log(`loading: ${loading}, data: ${data}, error: ${error}`);
  }, [loading, data, error]);

  const handleSubmit = () => {
    uploadSessionRecording({
      variables: {
        sessionId: sessionId,
        recording: file,
      },
    });
  };

  return (
    <>
      <DropzoneArea
        filesLimit={1}
        showFileNames
        // allow up to 300MB files
        maxFileSize={3000 * 1000 * 1000}
        dropzoneText={t("components.SessionRecordingUpload.dropzoneText")}
        getFileAddedMessage={() =>
          t("components.SessionRecordingUpload.addedFile")
        }
        getFileRemovedMessage={() =>
          t("components.SessionRecordingUpload.removedFile")
        }
        onChange={onFilesChange}
      />
      {file && <Button onClick={handleSubmit}>Zacznij wysyłanie</Button>}
    </>
  );
}
