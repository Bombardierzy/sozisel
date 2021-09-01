import React, { ReactElement, useContext } from "react";
import { LiveEventContext } from "../LiveEventDetails";
import useFetchEventLiveResult from "../../../../../hooks/useFetchEventLiveResult/useFetchEventLiveResult";
import { useTranslation } from "react-i18next";

const PollLiveEventDetails = (): ReactElement => {
  const { t } = useTranslation("common");
  const { activeEvent, event, sessionId } = useContext(LiveEventContext);

  const { mostCommonAnswer, completedTrialsNumber } = useFetchEventLiveResult(
    sessionId,
    activeEvent.id,
    "PollResult"
  );

  if (event.eventData.__typename !== "Poll") {
    return <></>;
  }

  return <>{"test"}</>;
};

export default PollLiveEventDetails;
