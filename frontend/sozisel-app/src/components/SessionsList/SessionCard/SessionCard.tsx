import "./SessionCard.scss";

import { AUTO_HIDE_DURATION, LOCAL_DATE_FORMAT } from "../../../common/consts";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import React, {
  BaseSyntheticEvent,
  MouseEvent,
  ReactElement,
  useMemo,
  useState,
} from "react";

import { Alert } from "@material-ui/lab";
import CustomAvatar from "../../utils/Avatar/CustomAvatar";
import DeleteIcon from "@material-ui/icons/Delete";
import { Session } from "../../../model/Session";
import ShareIcon from "@material-ui/icons/Share";
import { ShareLinkPopup } from "../../utils/Popups/ShareLinkPopup";
import { useHistory } from "react-router-dom";
import useSessionStatus from "../../../hooks/useSessionStatus";
import { useStartSessionMutation } from "../../../graphql";
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
  const [raised, setRaised] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const sessionStatus = useMemo(() => {
    if (isScheduled) return "start";
    if (isEnded) return "stopped";
    return "active";
  }, [isScheduled, isEnded]);

  const [startSessionMutation, { error, loading }] = useStartSessionMutation({
    variables: {
      id: session.id,
    },
  });

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  const onStartSession = async (e: MouseEvent) => {
    e.stopPropagation();
    await startSessionMutation();
    if (!error || !loading) {
      history.push(`/sessions/${session.id}/live`);
    }
  };

  const onCardClick = () => {
    if (isEnded) {
      history.push({
        pathname: `/sessions/${session.id}/result`,
      });
    } else if (!isScheduled) {
      history.push({
        pathname: `/sessions/${session.id}/live`,
      });
    } else {
      history.push({
        pathname: `/sessions/${session.id}/edit`,
      });
    }
  };

  return (
    <>
      <Card
        raised={raised}
        className="SessionCard"
        onMouseOver={onMouseOverChange}
        onMouseOut={onMouseOverChange}
        onClick={onCardClick}
      >
        <div className="sessionCardContent">
          <CustomAvatar id={session.id} />
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
              onClick={onStartSession}
              variant="contained"
              color="primary"
              fullWidth
              className="actionButton"
              disabled={!isScheduled}
            >
              {t(`components.SessionsList.${sessionStatus}Session`)}
            </Button>
          </CardActions>
        </div>
      </Card>
      <ShareLinkPopup
        link={sessionLink}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t("components.SessionsList.shareSession")}
        subtitle={t("components.SessionsList.shareSessionInfo")}
      />
      <Snackbar open={!!error} autoHideDuration={AUTO_HIDE_DURATION}>
        <Alert severity="error">
          {t("components.SessionsList.startSessionErrorMessage")}
        </Alert>
      </Snackbar>
    </>
  );
}
