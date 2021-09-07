import useFetchPollLiveResult, { PollSummary } from "./useFetchPollLiveResult";
import useFetchQuizLiveResult, { QuizResult } from "./useFetchQuizLiveResult";
import { Event } from "../../model/Template";
import { useEventResultSubmittedSubscription } from "../../graphql";

type EventResult = Partial<PollSummary> & Partial<QuizResult>;
export type Typename = "QuizSimpleResult" | "PollResult";

const useFetchEventLiveResult = (
  sessionId: string,
  event: Event,
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

  const pollResult = useFetchPollLiveResult({
    skip: typename !== "PollResult",
    eventResult,
    event,
    eventId,
  });

  switch (typename) {
    case "QuizSimpleResult":
      return quizResult;
    case "PollResult":
      return pollResult;
  }
};

export default useFetchEventLiveResult;
