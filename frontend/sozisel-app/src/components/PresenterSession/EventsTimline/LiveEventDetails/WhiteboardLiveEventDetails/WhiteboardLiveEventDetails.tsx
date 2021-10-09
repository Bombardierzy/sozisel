import React, { ReactElement, useContext } from "react";
import { LiveEventContext } from "../LiveEventDetails";
import TextSection from "../TextSection";
import Timer from "../Timer";
import useFetchEventLiveResult from "../../../../../hooks/useFetchEventLiveResult/useFetchEventLiveResult";
import { useTranslation } from "react-i18next";

const WhiteboardLiveEventDetails = (): ReactElement => {
  const { t } = useTranslation("common");
  const {
    activeEvent,
    event,
    sessionId,
    onFinishCallback,
  } = useContext(LiveEventContext);

  const { finishedTrials } = useFetchEventLiveResult(
    sessionId,
    event,
    activeEvent.id,
    "WhiteboardResult"
  );

  if (event.eventData.__typename !== "Whiteboard") {
    return <></>;
  }

  return (
    <div className="LiveEventsDetails">
      <span className="eventName">{event.name}</span>
      <TextSection
        text={t(
          "components.PresenterSession.EventsTimeline.LiveEventDetails.reamaingTime"
        )}
      >
        <Timer
          startValue={activeEvent.currentSec}
          onFinishCallback={onFinishCallback}
        />
      </TextSection>
      <TextSection
        text={t(
          "components.PresenterSession.EventsTimeline.LiveEventDetails.completedTrialsNumber",
          { value: finishedTrials }
        )}
      />
    </div>
  );
};

export default WhiteboardLiveEventDetails;
