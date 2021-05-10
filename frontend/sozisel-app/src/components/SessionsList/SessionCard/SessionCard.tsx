import "./SessionCard.scss";

import { BaseSyntheticEvent, ReactElement, useState } from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { Session } from "../../../graphql";
import ShareIcon from "@material-ui/icons/Share";
import Typography from "@material-ui/core/Typography";
import getSessionStatus from "../../../model/utils/session";
import useAvatarById from "../../../hooks/useAvatarById";
import { useTranslation } from "react-i18next";

export interface SessionCardProps {
  key: string;
  session: Session;
}

export default function SessionCard({
  session,
}: SessionCardProps): ReactElement {
  const { t } = useTranslation("common");
  const avatar = useAvatarById(session.id);
  const [raised, setRaised] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  return (
    <Card
      raised={raised}
      className="materialCard"
      onMouseOver={onMouseOverChange}
      onMouseOut={onMouseOverChange}
    >
      <div className="sessionCard">
        <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
        <CardContent className="cardContent">
          <Typography component="h5" variant="h5">
            {session.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {t("components.SessionsList.scheduledDate")}:{" "}
            {new Date(session.scheduledStartTime).toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t("components.SessionsList.status")}: {getSessionStatus(session)}
          </Typography>
        </CardContent>
        <CardActions className="cardActions">
          <div className="iconButtons">
            <IconButton disabled={getSessionStatus(session) == "Zakończona"}>
              <ShareIcon />
            </IconButton>
            <IconButton disabled={getSessionStatus(session) == "Zakończona"}>
              <DeleteIcon />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="actionButton"
            disabled={getSessionStatus(session) == "Zakończona"}
          >
            {t("components.SessionsList.startSession")}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
