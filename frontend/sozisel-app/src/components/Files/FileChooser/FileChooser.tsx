import "./FileChooser.scss";

import {
  Button,
  Dialog,
  FormHelperText,
  FormLabel,
  IconButton,
  Typography,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
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
  const [error, setError] = useState<boolean>(false);
  const handleSubmit = () => {
    if (file !== null) {
      setError(false);
      onSubmit(file);
      setFile(null);
    } else {
      setError(true);
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <div className="FileChooser">
        <div className="dialogTitle">
          <Typography component="h5" variant="h5">
            {t("components.Files.chooseFile")}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="dialogContent">
          <div className="formInput">
            <FormLabel htmlFor="file">
              {t("components.Files.fileToImport")}
            </FormLabel>
            <input
              required
              type="file"
              name="file"
              accept=".pdf"
              onChange={(event) => {
                const files = event.target.files;
                if (files && files?.length > 0) {
                  setFile(files[0]);
                }
              }}
            />
            <FormHelperText>
              {t("components.Files.availableFormats")}
            </FormHelperText>
          </div>

          <Button
            variant="contained"
            color="primary"
            className="submitButton"
            onClick={handleSubmit}
          >
            {t("components.Files.submit")}
          </Button>
          {error && (
            <Typography className="error">
              {t("components.Files.fileChooseError")}
            </Typography>
          )}
        </div>
      </div>
    </Dialog>
  );
}
