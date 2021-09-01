import useFetchPollLiveResult, { PollResult } from "./useFetchPollLiveResult";
import useFetchQuizLiveResult, { QuizResult } from "./useFetchQuizLiveResult";
import { useEventResultSubmittedSubscription } from "../../graphql";

type EventResult = Partial<PollResult> & Partial<QuizResult>;
export type Typename = "QuizSimpleResult" | "PollResult";

const useFetchEventLiveResult = (
  sessionId: string,
  eventId: string,
  typename: Typename
): EventResult => {
  const { data: eventResult } = useEventResultSubmittedSubscription({
    variables: {
      sessionId,
    },
  });

  const quizResult = useFetchQuizLiveResult({
    skip: typename !== "QuizSimpleResult",
    eventResult,
    eventId,
  });

  const pollResult = useFetchPollLiveResult(
    typename !== "QuizSimpleResult",
    eventId
  );

  switch (typename) {
    case "QuizSimpleResult":
      return quizResult;
    case "PollResult":
      return pollResult;
  }
};

export default useFetchEventLiveResult;
