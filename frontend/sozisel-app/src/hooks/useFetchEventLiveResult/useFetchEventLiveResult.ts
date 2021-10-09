import useFetchPollLiveResult, { PollSummary } from "./useFetchPollLiveResult";
import useFetchQuizLiveResult, { QuizResult } from "./useFetchQuizLiveResult";
import useFetchWhiteboardLiveResult, {
  WhiteboardResult,
} from "./useFetchWhiteboardLiveResult";
import { Event } from "../../model/Template";
import { useEventResultSubmittedSubscription } from "../../graphql";

type EventResult = Partial<PollSummary> &
  Partial<QuizResult> &
  Partial<WhiteboardResult>;
export type Typename = "QuizSimpleResult" | "PollResult" | "WhiteboardResult";

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

  const whiteboardResult = useFetchWhiteboardLiveResult({
    skip: typename !== "WhiteboardResult",
    eventResult,
    eventId,
  });

  switch (typename) {
    case "QuizSimpleResult":
      return quizResult;
    case "PollResult":
      return pollResult;
    case "WhiteboardResult":
      return whiteboardResult;
  }
};

export default useFetchEventLiveResult;
