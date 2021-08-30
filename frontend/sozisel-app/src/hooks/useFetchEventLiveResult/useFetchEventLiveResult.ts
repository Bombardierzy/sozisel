import useFetchQuizLiveResult, { QuizResult } from "./useFetchQuizLiveResult";
import { useEventResultSubmittedSubscription } from "../../graphql";

type EventResult = QuizResult;
export type Typename = "QuizSimpleResult";

const useFetchEventLiveResult = (
  sessionId: string,
  eventId: string,
  typename: Typename
): EventResult => {
  const { data: eventResult } =
    useEventResultSubmittedSubscription({
      variables: {
        sessionId,
      },
    });

  const quizResult = useFetchQuizLiveResult({ skip: typename !== "QuizSimpleResult", eventResult, eventId });

  switch (typename) {
    case "QuizSimpleResult":
      return quizResult;
  }
};

export default useFetchEventLiveResult;
