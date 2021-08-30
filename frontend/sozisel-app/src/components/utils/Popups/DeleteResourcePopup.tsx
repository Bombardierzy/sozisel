import "./DeleteResourcePopup.scss";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";

import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface DeleteResourcePopupProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteResourcePopup({
  open,
  title,
  onCancel,
  onDelete,
}: DeleteResourcePopupProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <Dialog
      classes={{
        root: "DeleteResourcePopup",
      }}
      onClose={onCancel}
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography className="warning">
          {t("components.DeleteResourcePopup.warning")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button classes={{ label: "button cancel" }} onClick={onCancel}>
          {t("components.DeleteResourcePopup.cancel")}
        </Button>
        <Button
          classes={{ label: "button" }}
          variant="contained"
          color="primary"
          onClick={onDelete}
        >
          {t("components.DeleteResourcePopup.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
