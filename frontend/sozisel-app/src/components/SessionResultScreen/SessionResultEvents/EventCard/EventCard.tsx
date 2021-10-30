import "./EventCard.scss";

import {
  Button,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";

import CustomAvatar from "../../../utils/Avatar/CustomAvatar";
import { EventParticipation } from "../../../../graphql";
import { getEventTypeName } from "../../../utils/Events/getEventType";
import { useTranslation } from "react-i18next";

export interface EventCardProps {
  key: string;
  event: EventParticipation;
  onClick: () => void;
}

export default function EventCard({
  event,
  onClick,
}: EventCardProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <div className="EventCard">
      <CustomAvatar id={event.eventId} />
      <CardContent className="cardContent">
        <Typography component="h5" variant="h5">
          {event.eventName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {t("components.SessionEventResults.eventType")} :{" "}
          {getEventTypeName(event.eventType)}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {t("components.SessionEventResults.startTime")}: {event.startMinute}
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
          onClick={onClick}
        >
          {t("components.SessionEventResults.details")}
        </Button>
      </CardActions>
    </div>
  );
}
