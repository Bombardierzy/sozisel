import { useContext, useEffect, useState } from "react";
import useFetchPollLiveResult, { PollSummary } from "./useFetchPollLiveResult";
import useFetchQuizLiveResult, { QuizResult } from "./useFetchQuizLiveResult";
import useFetchWhiteboardLiveResult, {
  WhiteboardResult,
} from "./useFetchWhiteboardLiveResult";
import { LiveEventContext } from "../../components/PresenterSession/EventsTimeline/LiveEventDetails/LiveEventDetails";
import { useEventResultSubmittedSubscription } from "../../graphql";

type EventResult = Partial<PollSummary> &
  Partial<QuizResult> &
  Partial<WhiteboardResult>;
export type Typename = "QuizSimpleResult" | "PollResult" | "WhiteboardResult";

const useFetchEventLiveResult = (typename: Typename): EventResult => {
  const {
    activeEvent,
    event,
    sessionId,
    onFinishCallback,
    participantsNumber,
  } = useContext(LiveEventContext);

  const [completedTrialsNumber, setCompletedTrialsNumber] = useState<number>(0);

  const { data: eventResult } = useEventResultSubmittedSubscription({
    variables: {
      sessionId,
    },
  });

  useEffect(() => {
    if (eventResult && eventResult.eventResultSubmitted) {
      setCompletedTrialsNumber(
        (completedTrialsNumber) => completedTrialsNumber + 1
      );
    }
  }, [eventResult]);

  useEffect(() => {
    if (completedTrialsNumber === participantsNumber) {
      onFinishCallback();
    }
  }, [completedTrialsNumber, onFinishCallback, participantsNumber]);

  const quizResult = useFetchQuizLiveResult({
    skip: typename !== "QuizSimpleResult",
    eventResult,
    eventId: activeEvent.id,
  });

  const pollResult = useFetchPollLiveResult({
    skip: typename !== "PollResult",
    eventResult,
    event,
    eventId: activeEvent.id,
  });

  const whiteboardResult = useFetchWhiteboardLiveResult({
    skip: typename !== "WhiteboardResult",
    eventResult,
    eventId: activeEvent.id,
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
