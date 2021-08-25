import {
  EventResultSubmittedSubscription,
  QuizParticipantSummary,
  useEventResultSubmittedSubscription,
  useQuizParticipantsSummaryQuery,
} from "../graphql";
import { useEffect, useState } from "react";

type QuizParticipantsSummary = ({
  __typename?: "QuizParticipantSummary" | undefined;
} & Pick<QuizParticipantSummary, "numberOfPoints" | "fullName">)[];

interface EventResult {
  pointSum: number;
  completedTrialsNumber: number;
  scoresDistribution: ScoreDistribution[];
}

interface ScoreDistribution {
  score: number;
  counter: number;
}

type Typename = "QuizSimpleResult";

const addNewScore = (
  scoreDistribution: ScoreDistribution[],
  eventResult: EventResultSubmittedSubscription
) => {
  const resultData = eventResult.eventResultSubmitted?.resultData;
  if (resultData?.__typename === "QuizSimpleResult") {
    if (
      Array.isArray(scoreDistribution) &&
      scoreDistribution.filter((item) => item.score === resultData.totalPoints)
        .length
    ) {
      return scoreDistribution.map((item) =>
        item.score === resultData.totalPoints
          ? { ...item, counter: (item.counter += 1) }
          : item
      );
    }
    return [
      ...scoreDistribution,
      { score: resultData.totalPoints, counter: 1 },
    ];
  }
  return [];
};

const calculateNewPointSum = (
  eventResults: EventResult,
  eventResult: EventResultSubmittedSubscription,
  typename: Typename
): number => {
  const resultData = eventResult.eventResultSubmitted?.resultData;
  if (resultData?.__typename === typename) {
    return eventResults.pointSum + resultData.totalPoints;
  }
  return 0;
};

const calcualteScoreDistribution = (
  quizParticipantsSummary: QuizParticipantsSummary
) => {
  const uniqueScores = new Set(
    quizParticipantsSummary.map((item) => item.numberOfPoints)
  );
  return Array.from(uniqueScores).map((score) => ({
    score,
    counter: quizParticipantsSummary.filter(
      (item) => item.numberOfPoints === score
    ).length,
  }));
};

const useFetchEventLiveResult = (
  sessionId: string,
  eventId: string,
  typename: Typename
): EventResult => {
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

  const { data: participantsSummary, loading: participantsSummaryLoading } =
    useQuizParticipantsSummaryQuery({
      variables: {
        id: eventId,
      },
    });

  useEffect(() => {
    if (participantsSummary) {
      const { quizParticipantsSummary } = participantsSummary;
      setEventResults({
        pointSum: quizParticipantsSummary
          .map((item) => item.numberOfPoints)
          .reduce((prev, next) => prev + next, 0),
        completedTrialsNumber: quizParticipantsSummary.length,
        scoresDistribution: calcualteScoreDistribution(quizParticipantsSummary),
      });
    }
  }, [participantsSummary, participantsSummaryLoading]);

  useEffect(() => {
    if (
      !eventResultLoading &&
      eventResult &&
      eventResult?.eventResultSubmitted?.resultData.__typename === typename
    ) {
      setEventResults((eventResults) => ({
        pointSum: calculateNewPointSum(eventResults, eventResult, typename),
        completedTrialsNumber: eventResults.completedTrialsNumber + 1,
        scoresDistribution: addNewScore(
          eventResults.scoresDistribution,
          eventResult
        ),
      }));
    }
  }, [eventResult, eventResultLoading, typename]);

  return {
    ...eventResults,
    scoresDistribution: eventResults.scoresDistribution.sort((a, b) =>
      a.score > b.score ? 1 : -1
    ),
  };
};

export default useFetchEventLiveResult;
