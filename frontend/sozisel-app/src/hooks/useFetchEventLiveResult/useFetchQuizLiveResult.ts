import {
  EventResultSubmittedSubscription,
  QuizParticipantSummary,
  useQuizParticipantsLiveSummaryQuery,
} from "../../graphql";
import { useEffect, useState } from "react";

export type QuizResult = {
  pointSum: number;
  scoresDistribution: ScoreDistribution[];
  completedTrialsNumber: number;
};

export interface ScoreDistribution {
  score: number;
  counter: number;
}

interface Props {
  skip: boolean;
  eventResult: EventResultSubmittedSubscription | undefined;
  eventId: string;
}

type QuizParticipantsSummary = ({
  __typename?: "QuizParticipantSummary" | undefined;
} & Pick<QuizParticipantSummary, "numberOfPoints" | "fullName">)[];

// function will return distribution of scores for all participants including current completed trial
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

// function will return sum of all participants score including score of current completed trial
const calculateNewPointSum = (
  eventResults: QuizResult,
  eventResult: EventResultSubmittedSubscription
): number => {
  const resultData = eventResult.eventResultSubmitted?.resultData;
  if (resultData?.__typename === "QuizSimpleResult") {
    return eventResults.pointSum + resultData.totalPoints;
  }
  return 0;
};

// function will return score distrubution for all completed trials, data comes in the form of array [{user, score}]
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

const useFetchQuizLiveResult = ({
  skip,
  eventResult,
  eventId,
}: Props): QuizResult => {
  const [quizResults, setQuziResults] = useState<QuizResult>({
    pointSum: 0,
    scoresDistribution: [],
    completedTrialsNumber: 0,
  });

  const { data: participantsSummary, loading: participantsSummaryLoading } =
    useQuizParticipantsLiveSummaryQuery({
      skip,
      variables: {
        id: eventId,
      },
    });

  useEffect(() => {
    if (
      eventResult &&
      eventResult?.eventResultSubmitted?.resultData.__typename ===
        "QuizSimpleResult"
    ) {
      setQuziResults((quizResults) => ({
        pointSum: calculateNewPointSum(quizResults, eventResult),
        scoresDistribution: addNewScore(
          quizResults.scoresDistribution,
          eventResult
        ),
        completedTrialsNumber: quizResults.completedTrialsNumber + 1,
      }));
    }
  }, [eventResult]);

  useEffect(() => {
    if (participantsSummary) {
      const { quizParticipantsSummary } = participantsSummary;
      setQuziResults({
        pointSum: quizParticipantsSummary
          .map((item) => item.numberOfPoints)
          .reduce((prev, next) => prev + next, 0),
        scoresDistribution: calcualteScoreDistribution(quizParticipantsSummary),
        completedTrialsNumber: quizParticipantsSummary.length,
      });
    }
  }, [participantsSummary, participantsSummaryLoading]);

  return {
    ...quizResults,
    scoresDistribution: quizResults.scoresDistribution.sort((a, b) =>
      a.score > b.score ? 1 : -1
    ),
  };
};

export default useFetchQuizLiveResult;
