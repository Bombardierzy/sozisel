import "./SessionCard.scss";

import { BaseSyntheticEvent, ReactElement, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { LOCAL_DATE_FORMAT } from "../../../common/consts";
import { Session } from "../../../model/Session";
import ShareIcon from "@material-ui/icons/Share";
import useAvatarById from "../../../hooks/useAvatarById";
import { useHistory } from "react-router-dom";
import useSessionStatus from "../../../hooks/useSessionStatus";
import { useTranslation } from "react-i18next";

export interface SessionCardProps {
  key: string;
  session: Session;
  onDelete: (id: string) => void;
}

export default function SessionCard({
  session,
  onDelete,
}: SessionCardProps): ReactElement {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { status, isScheduled, isEnded } = useSessionStatus(session);
  const sessionLink = `${window.location.protocol}//${window.location.hostname}/sessions/${session.id}/join`;
  const avatar = useAvatarById(session.id);
  const [raised, setRaised] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  const onCardClick = () => {
    history.push({
      pathname: `/sessions/${session.id}/edit`,
    });
  };

  return (
    <>
      <Card
        raised={raised}
        className="materialCard"
        onMouseOver={onMouseOverChange}
        onMouseOut={onMouseOverChange}
        onClick={onCardClick}
      >
        <div className="sessionCard">
          <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
          <CardContent className="cardContent">
            <Typography component="h5" variant="h5">
              {session.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {t("components.SessionsList.scheduledDate")}:{" "}
              {new Date(session.scheduledStartTime).toLocaleString(
                [],
                LOCAL_DATE_FORMAT
              )}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {t("components.SessionsList.status")}: {status}
            </Typography>
          </CardContent>
          <CardActions className="cardActions">
            <div className="iconButtons">
              <IconButton
                disabled={isEnded}
                onClick={(e) => {
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
              >
                <ShareIcon />
              </IconButton>
              <IconButton
                disabled={!isScheduled}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="actionButton"
              disabled={!isScheduled}
            >
              {t("components.SessionsList.startSession")}
            </Button>
          </CardActions>
        </div>
      </Card>
      <Dialog
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        maxWidth="sm"
        fullWidth
      >
        <div className="shareDialog">
          <div className="dialogTitle">
            <Typography className="dialogTitleText">
              {t("components.SessionsList.shareSession")}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
          <DialogContent className="dialogContent">
            <Typography className="subTitleDialogText">
              {t("components.SessionsList.shareSessionInfo")}
            </Typography>
            <Typography variant="button" className="shareLabel">
              {t("components.SessionsList.shareLabel")}
            </Typography>
            <div className="linkInput">
              <input className="linkText" value={sessionLink} readOnly />
              <div className="copyIconContainer">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(`${sessionLink}`);
                  }}
                >
                  <FileCopyIcon className="copyIcon"></FileCopyIcon>
                </IconButton>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
