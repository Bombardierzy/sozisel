import "./FileChooser.scss";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import { DropzoneArea } from "material-ui-dropzone";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import { useTranslation } from "react-i18next";

export interface FileChooserProps {
  onSubmit: (file: File) => void;
  onClose: () => void;
  open: boolean;
}
export function FileChooser({
  onSubmit,
  onClose,
  open,
}: FileChooserProps): ReactElement {
  const { t } = useTranslation("common");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (file !== null) {
      onSubmit(file);
      setFile(null);
    }
  };

  return (
    <Dialog className="FileChooser" open={open} onClose={onClose}>
      <Typography variant="h6" className="poppinsBoldText">
        {t("components.Files.importFile")}
      </Typography>
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
          getPreviewIcon={() => <InsertDriveFileOutlinedIcon />}
          filesLimit={1}
          showFileNames
          acceptedFiles={[".pdf"]}
          dropzoneText={t("components.Files.importFileInfo")}
          onChange={(files) => {
            if (files && files?.length > 0) {
              setFile(files[0]);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("components.Files.cancel")}</Button>
        <Button disabled={file === null} onClick={handleSubmit}>
          {t("components.Files.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
