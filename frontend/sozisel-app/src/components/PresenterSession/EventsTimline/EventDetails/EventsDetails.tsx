import "./EventDetails.scss";
import { Event, Quiz } from "../../../../model/Template";
import React, { ReactElement } from "react";
import { Poll } from "../../../../graphql";
import PollDetails from "./PollDetails/PollDetails";
import QuizDetails from "./QuizDetails/QuizDetails";
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
      {!activeEventId && (
        <>
          <Typography className="eventDetailsHeader">
            {t("components.PresenterSession.EventsTimeline.eventDetailsHeader")}
          </Typography>
          <p className="durationTime">
            {t(
              "components.PresenterSession.EventsTimeline.QuizDetails.durationTime",
              { value: activeEvent.durationTimeSec }
            )}
          </p>
          {activeEvent.eventData.__typename === "Quiz" && (
            <QuizDetails quiz={activeEvent.eventData as Quiz} />
          )}
          {activeEvent.eventData.__typename === "Poll" && (
            <PollDetails poll={activeEvent.eventData as Poll} />
          )}
        </>
      )}
    </div>
  );
}
