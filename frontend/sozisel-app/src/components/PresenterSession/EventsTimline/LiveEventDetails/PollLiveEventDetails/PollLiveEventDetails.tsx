import React, { ReactElement, useContext } from "react";
import { LiveEventContext } from "../LiveEventDetails";
import PollPieChart from "../../../../utils/PollPieChart/PollPieChart";
import TextSection from "../TextSection";
import Timer from "../Timer";
import useFetchEventLiveResult from "../../../../../hooks/useFetchEventLiveResult/useFetchEventLiveResult";
import { useTranslation } from "react-i18next";

const PollLiveEventDetails = (): ReactElement => {
  const { t } = useTranslation("common");
  const {
    activeEvent,
    event,
    sessionId,
    onFinishCallback,
    participantsNumber,
  } = useContext(LiveEventContext);

  const { mostAnsweredOption, totalVoters, optionsSummary } =
    useFetchEventLiveResult(sessionId, event, activeEvent.id, "PollResult");

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
              value: participantsNumber,
            }
          )}
        />
        <TextSection
          text={t(
            "components.PresenterSession.EventsTimeline.LiveEventDetails.completedTrialsNumber",
            { value: totalVoters }
          )}
        />
        {!!mostAnsweredOption && totalVoters && totalVoters > 0 && (
          <TextSection
            text={t(
              "components.PresenterSession.EventsTimeline.LiveEventDetails.mostCommonAnswer",
              { text: mostAnsweredOption }
            )}
          />
        )}
      </div>
      {optionsSummary && (
        <PollPieChart
          data={optionsSummary.filter((option) => option.votes > 0)}
        />
      )}
    </div>
  );
};

export default PollLiveEventDetails;
