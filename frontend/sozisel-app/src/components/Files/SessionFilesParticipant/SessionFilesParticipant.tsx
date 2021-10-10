import "./SessionFilesParticipant.scss";

import { Dialog, IconButton, List, Paper, Typography } from "@material-ui/core";
import { ReactElement, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import FileCard from "../FileCard/FileCard";
import { useTranslation } from "react-i18next";

export interface SessionFilesParticipantProps {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}
export function SessionFilesParticipant({
  sessionId,
  open,
  onClose,
}: SessionFilesParticipantProps): ReactElement {
  const { t } = useTranslation("common");
  const onFileDownload = () => {
    //TODO add file download
  };

  //temporary mock
  const [files, setFiles] = useState<string[]>(["aaa", "bbb"]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      <div className="SessionFilesParticipant">
        <div className="dialogTitle">
          <Typography component="h5" variant="h5">
            {t("components.Files.sessionFiles")}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Paper className="dialogContent">
          <List className="filesList">
            {files.map((element, _) => (
              <FileCard
                key={element}
                filename={element}
                fileId={element}
                onDownload={onFileDownload}
              />
            ))}
          </List>
        </Paper>
      </div>
    </Dialog>
  );
}
