import "./ShareLinkPopup.scss";

import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface ShareLinkPopupProps {
  open: boolean;
  link: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}

export function ShareLinkPopup({
  open,
  link,
  title,
  subtitle,
  onClose,
}: ShareLinkPopupProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <div className="ShareSessionDialog">
        <div className="dialogTitle">
          <Typography className="dialogTitleText">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent className="dialogContent">
          <Typography className="subTitleDialogText">{subtitle}</Typography>
          <Typography variant="button" className="shareLabel">
            Link
          </Typography>
          <div className="linkInput">
            <input className="linkText" value={link} readOnly />
            <div className="copyIconContainer">
              <Tooltip
                arrow
                placement="top"
                title={t("components.ShareLinkPopup.copyToClipboard") as string}
              >
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(`${link}`);
                  }}
                >
                  <FileCopyIcon className="copyIcon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
