import "./EventCard.scss";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import React, { BaseSyntheticEvent, ReactElement, useState } from "react";

import useAvatarById from "../../../../hooks/useAvatarById";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// temporary mock

export interface MockEvent {
  name: string;
  id: string;
  startMinute: number;
}

export interface EventCardProps {
  key: string;
  event: MockEvent;
}

export default function EventCard({ event }: EventCardProps): ReactElement {
  const { t } = useTranslation("common");
  const history = useHistory();
  const avatar = useAvatarById(event.id);
  const [raised, setRaised] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  return (
    <>
      <Card
        raised={raised}
        className="EventCard"
        onMouseOver={onMouseOverChange}
        onMouseOut={onMouseOverChange}
      >
        <div className="eventCardContent">
          <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
          <CardContent className="cardContent">
            <Typography component="h5" variant="h5">
              {event.name}
            </Typography>
            {/* TODO add hook useEventType */}
            <Typography variant="subtitle1" color="textSecondary">
              {t("components.SessionEventResults.eventType")} : Quiz
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {t("components.SessionEventResults.startTime")}:{" "}
              {event.startMinute}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {t("components.SessionEventResults.participantNumber")}: 55
            </Typography>
          </CardContent>
          <CardActions className="cardActions">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="actionButton"
            >
              {t("components.SessionEventResults.details")}
            </Button>
          </CardActions>
        </div>
      </Card>
    </>
  );
}
