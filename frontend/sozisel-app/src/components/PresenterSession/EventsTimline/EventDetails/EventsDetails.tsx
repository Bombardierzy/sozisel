import "./EventDetails.scss";

import React, { ReactElement } from "react";

import { Event } from "../../../../model/Template";
import QuizDetails from "../QuizDetails/QuizDetails";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface EventDetailsProps {
  activeEvent: Event;
  activeEventId: string;
}

export default function EventDetails({
  activeEvent,
  activeEventId,
}: EventDetailsProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <div className="eventDetails">
      {!activeEventId && activeEvent.eventData.__typename === "Quiz" && (
        <>
          <Typography className="eventDetailsHeader">
            {t("components.PresenterSession.EventsTimeline.eventDetailsHeader")}
          </Typography>
          <QuizDetails
            durationTime={activeEvent.durationTimeSec}
            quiz={activeEvent.eventData}
          />
        </>
      )}
    </div>
  );
}
