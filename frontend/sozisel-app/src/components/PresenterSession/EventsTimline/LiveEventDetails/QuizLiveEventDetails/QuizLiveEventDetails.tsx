import React, { ReactElement, useContext } from "react";
import { LiveEventContext } from "../LiveEventDetails";
import Timer from "../Timer";
import Title from "../Title";
import useFetchEventLiveResult from "../../../../../hooks/useFetchEventLiveResult";
import { useTranslation } from "react-i18next";

const QuziLiveEventDetails = (): ReactElement => {
  const { t } = useTranslation("common");
  const { activeEvent, event, sessionId, onFinishCallback } =
    useContext(LiveEventContext);

  const { pointSum, completedTrialsNumber, scoresDistribution } =
    useFetchEventLiveResult(sessionId, activeEvent.id, "QuizSimpleResult");
  return (
    <div className="LiveEventsDetails">
      <b>{event.name}</b>
      <Title
        title={t(
          "components.PresenterSession.EventsTimeline.LiveEventDetails.reamaingTime"
        )}
      >
        <Timer
          startValue={activeEvent.currentSec}
          onFinishCallback={onFinishCallback}
        />
      </Title>
      <Title
        title={t(
          "components.PresenterSession.EventsTimeline.LiveEventDetails.averagePoint",
          {
            value: completedTrialsNumber
              ? (pointSum / completedTrialsNumber).toPrecision(2)
              : 0,
          }
        )}
      />
      <Title
        title={t(
          "components.PresenterSession.EventsTimeline.LiveEventDetails.completedTrialsNumber",
          { value: completedTrialsNumber }
        )}
      />
    </div>
  );
};

export default QuziLiveEventDetails;
