import React, { ReactElement, useContext } from "react";
import { LiveEventContext } from "../LiveEventDetails";
import ScoreChart from "../../../../utils/ScoreChart/ScoreChart";
import TextSection from "../TextSection";
import Timer from "../Timer";
import useFetchEventLiveResult from "../../../../../hooks/useFetchEventLiveResult";
import { useTranslation } from "react-i18next";

const QuziLiveEventDetails = (): ReactElement => {
  const { t } = useTranslation("common");
  const {
    activeEvent,
    event,
    sessionId,
    onFinishCallback,
    participantsNumber,
  } = useContext(LiveEventContext);

  const { pointSum, completedTrialsNumber, scoresDistribution } =
    useFetchEventLiveResult(sessionId, activeEvent.id, "QuizSimpleResult");

  return (
    <div className="LiveEventsDetails">
      <div>
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
            "components.PresenterSession.EventsTimeline.LiveEventDetails.numberOfParticipants",
            {
              value:
                event.eventData.__typename === "Quiz" &&
                (event.eventData.targetPercentageOfParticipants / 100) *
                  participantsNumber,
            }
          )}
        />
        <TextSection
          text={t(
            "components.PresenterSession.EventsTimeline.LiveEventDetails.averagePoint",
            {
              value: completedTrialsNumber
                ? (pointSum / completedTrialsNumber).toPrecision(2)
                : 0,
              totalPoint:
                event.eventData.__typename === "Quiz" &&
                event.eventData.quizQuestions.length,
            }
          )}
        />
        <TextSection
          text={t(
            "components.PresenterSession.EventsTimeline.LiveEventDetails.completedTrialsNumber",
            { value: completedTrialsNumber }
          )}
        />
      </div>
      {scoresDistribution.length > 0 && (
        <ScoreChart data={scoresDistribution} />
      )}
    </div>
  );
};

export default QuziLiveEventDetails;
