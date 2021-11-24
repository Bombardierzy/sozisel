import "./ParticipantSessionFiles.scss";

import {
  CircularProgress,
  Dialog,
  IconButton,
  List,
  Paper,
  Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import ErrorAlert from "../../utils/Alerts/ErrorAlert";
import FileCard from "../FileCard/FileCard";
import { ReactElement } from "react";
import { useParticipantFilesQuery } from "../../../graphql";
import useSessionParticipantType from "../../../hooks/useSessionParticipantType";
import { useTranslation } from "react-i18next";

export interface ParticipantSessionFilesProps {
  sessionId: string;
  timestamp: string;
  open: boolean;
  onClose: () => void;
}
export function ParticipantSessionFiles({
  sessionId,
  timestamp,
  open,
  onClose,
}: ParticipantSessionFilesProps): ReactElement {
  const { t } = useTranslation("common");
  const { token } = useSessionParticipantType();
  // added timestamp to variables as a workaround,
  // because network-only fetch policy is broken
  // see https://github.com/apollographql/react-apollo/issues/556
  const { data, loading } = useParticipantFilesQuery({
    variables: { sessionId, token, timestamp },
  });

  if (loading) {
    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
        <div className="ParticipantSessionFiles">
          <CircularProgress />
        </div>
      </Dialog>
    );
  }

  if (data?.participantSessionResources) {
    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
        <div className="ParticipantSessionFiles">
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
              {data.participantSessionResources.map((element, _) => (
                <FileCard
                  key={element.id}
                  filename={element.sessionResource.filename}
                  fileId={element.id}
                  path={element.sessionResource.path}
                />
              ))}
            </List>
          </Paper>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      <div className="ParticipantSessionFiles">
        <ErrorAlert />
      </div>
    </Dialog>
  );
}
