import { useEventResultSubmittedSubscription, useQuizParticipantsSummaryQuery, useQuizQuestionsSummaryQuery } from "../graphql";

import { useEffect } from "react";

const useFetchEventLiveResult = (sessionId: string, eventId: string): void => {
  const { data: eventResult, loading: eventResultLoading } = useEventResultSubmittedSubscription({
    variables: {
      sessionId,
    },
  });

  const { data: questionsSummary, loading: questionsSummaryLoading } = useQuizQuestionsSummaryQuery({
    variables: {
      id: eventId,
    },
  });

  const { data: participantsSummary, loading: participantsSummaryLoading } = useQuizParticipantsSummaryQuery({
    variables: {
      id: eventId,
    },
  });

  const loading = eventResultLoading || questionsSummaryLoading || participantsSummaryLoading;

  useEffect(() => {
    console.log(questionsSummary);
    console.log(participantsSummary);
    if (eventResult && !loading) {
      console.log(eventResult);
    }
  }, [loading, eventResult, questionsSummary, participantsSummary]);
};

export default useFetchEventLiveResult;
