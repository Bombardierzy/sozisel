import {
  EventType,
  useGetEventTypename,
} from "../../hooks/useGetEventTypename";
import React, { ReactElement } from "react";
import { ParticipantEvent } from "../../graphql";
import ParticipantPollEvent from "./Modules/PollEvent/ParticipantPollEvent";
import { ParticipantQuizContextProvider } from "../../contexts/ParticipantQuiz/ParticipantQuizContext";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import ParticipantWhiteboardEvent from "./Modules/WhiteboardEvent/ParticipantWhiteboardEvent";

interface ActiveEventProps {
  activeEvent: ParticipantEvent;
  token: string;
  onEventFinished: () => void;
  withJitsi?: boolean;
}

const ActiveEvent = ({
  activeEvent,
  token,
  onEventFinished,
  withJitsi,
}: ActiveEventProps): ReactElement => {
  const eventType = useGetEventTypename(activeEvent);
  switch (eventType) {
    case EventType.ParticipantQuiz:
      return (
        <ParticipantQuizContextProvider>
          <ParticipantQuizEvent
            onQuizFinished={onEventFinished}
            token={token}
            event={activeEvent}
          />
        </ParticipantQuizContextProvider>
      );
    case EventType.Poll:
      return (
        <ParticipantPollEvent
          token={token}
          event={activeEvent}
          onPollFinished={onEventFinished}
        />
      );
    case EventType.Whiteboard:
      return (
        <ParticipantWhiteboardEvent
          token={token}
          event={activeEvent}
          onWhiteboardFinished={onEventFinished}
          withJitsi={withJitsi || false}
        />
      );
    default:
      return <></>;
  }
};

export default ActiveEvent;
