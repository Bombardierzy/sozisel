import {
  EventResultSubmittedSubscription,
  useEventResultSubmittedSubscription,
  useQuizParticipantsSummaryQuery,
  useQuizQuestionsSummaryQuery,
} from "../graphql";
import { useEffect, useState } from "react";


interface EventResult {
  pointSum: number;
  completedTrialsNumber: number;
  scoresDistribution: ScoreDistribution[];
}

interface ScoreDistribution {
  score: number;
  counter: number;
}

type Typename = 'QuizSimpleResult';

const addNewScore = (scoreDistribution: ScoreDistribution[], eventResult: EventResultSubmittedSubscription, typename: Typename) => {
  const resultData = eventResult.eventResultSubmitted?.resultData;
  if(resultData?.__typename === typename) {
    if(scoreDistribution.some((item) => item.score === resultData.totalPoints)) {
      scoreDistribution.map((item) => item.score === resultData.totalPoints
        ? {...item, counter: item.counter++ }
        : item
      )
    }
    return [...scoreDistribution, { score: resultData.totalPoints, counter: 1 }];
  }
  return [];
};

const useFetchEventLiveResult = (sessionId: string, eventId: string, typename: Typename): void => {
  const [eventResults, setEventResults] = useState<EventResult>({
    pointSum: 0,
    completedTrialsNumber: 0,
    scoresDistribution: [],
  });

  const { data: eventResult, loading: eventResultLoading } =
    useEventResultSubmittedSubscription({
      variables: {
        sessionId,
      },
    });

  const { data: questionsSummary, loading: questionsSummaryLoading } =
    useQuizQuestionsSummaryQuery({
      variables: {
        id: eventId,
      },
    });

  const { data: participantsSummary, loading: participantsSummaryLoading } =
    useQuizParticipantsSummaryQuery({
      variables: {
        id: eventId,
      },
    });

  const calculateNewPointSum = (eventResult: EventResultSubmittedSubscription): number => {
    const resultData = eventResult.eventResultSubmitted?.resultData;
    if(resultData?.__typename === typename) {
      return eventResults.pointSum + resultData.totalPoints;
    }
    return 0;
  }

  const loading =
    eventResultLoading || questionsSummaryLoading || participantsSummaryLoading;

  useEffect(() => {
    if (!eventResultLoading && eventResult) {
      setEventResults({
        pointSum: calculateNewPointSum(eventResult),
        completedTrialsNumber: eventResults.completedTrialsNumber + 1,
        scoresDistribution: addNewScore(eventResults.scoresDistribution, eventResult, typename),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventResult]);

  useEffect(() => {
    console.log(eventResults);
  }, [eventResults]);
};

export default useFetchEventLiveResult;
