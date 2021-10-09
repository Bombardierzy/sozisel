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
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <div className="FileChooser">
        <div className="dialogTitle">
          <Typography component="h5" variant="h5">
            Wybierz plik
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
            <FormLabel htmlFor="file">Plik do zaimportowania</FormLabel>
            <input required type="file" name="file" id="file" accept=".pdf" />
            <FormHelperText>Akceptowane formaty: .pdf</FormHelperText>
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
