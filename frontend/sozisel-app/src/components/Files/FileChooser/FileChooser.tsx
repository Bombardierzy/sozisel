import "./FileChooser.scss";

import {
  Button,
  Dialog,
  FormHelperText,
  FormLabel,
  IconButton,
  Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

export interface FileChooserProps {
  onSubmit: () => void;
  onClose: () => void;
  open: boolean;
}
export function FileChooser({
  onSubmit,
  onClose,
  open,
}: FileChooserProps): ReactElement {
  const { t } = useTranslation("common");
  const handleSubmit = () => {
    onSubmit();
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
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="form"
        >
          <div className="formInput">
            <FormLabel htmlFor="file">
              {t("components.Files.fileToImport")}
            </FormLabel>
            <input required type="file" name="file" id="file" accept=".pdf" />
            <FormHelperText>
              {t("components.Files.availableFormats")}
            </FormHelperText>
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="submitButton"
          >
            {"Zatwierdź"}
          </Button>
        </form>
      </div>
    </Dialog>
  );
}
