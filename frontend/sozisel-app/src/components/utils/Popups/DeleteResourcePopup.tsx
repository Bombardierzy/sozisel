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
    <Dialog onClose={onCancel} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{t("components.DeleteResourcePopup.warning")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          {t("components.DeleteResourcePopup.cancel")}
        </Button>
        <Button variant="contained" color="primary" onClick={onDelete}>
          {t("components.DeleteResourcePopup.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
