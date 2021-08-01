import "./EventCard.scss";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import React, { BaseSyntheticEvent, ReactElement, useState } from "react";

import CustomAvatar from "../../../utils/Avatar/CustomAvatar";
import { EventParticipation } from "../../../../graphql";
import { useTranslation } from "react-i18next";

export interface EventCardProps {
  key: string;
  event: EventParticipation;
}

export default function EventCard({ event }: EventCardProps): ReactElement {
  const { t } = useTranslation("common");
  const [raised, setRaised] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  const onButtonClick = () => {
    // TODO navigate to event details base on event type
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
          <CustomAvatar id={event.eventId} />
          <CardContent className="cardContent">
            <Typography component="h5" variant="h5">
              {event.eventName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {t("components.SessionEventResults.eventType")} :{" "}
              {event.eventType}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {t("components.SessionEventResults.startTime")}:{" "}
              {event.startMinute}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {t("components.SessionEventResults.participantNumber")}:{" "}
              {event.submissions}
            </Typography>
          </CardContent>
          <CardActions className="cardActions">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="actionButton"
              onClick={onButtonClick}
            >
              {t("components.SessionEventResults.details")}
            </Button>
          </CardActions>
        </div>
      </Card>
    </>
  );
}
