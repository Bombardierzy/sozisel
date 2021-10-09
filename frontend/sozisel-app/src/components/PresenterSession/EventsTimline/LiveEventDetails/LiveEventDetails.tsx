import "./LiveEventDetails.scss";

import React, { ReactElement, createContext } from "react";

import { ActiveEvent } from "../EventsTimeline";
import { Event } from "../../../../model/Template";
import PollLiveEventDetails from "./PollLiveEventDetails/PollLiveEventDetails";
import QuziLiveEventDetails from "./QuizLiveEventDetails/QuizLiveEventDetails";
import WhiteboardLiveEventDetails from "./WhiteboardLiveEventDetails/WhiteboardLiveEventDetails";

interface LiveEventDetailsProps {
  activeEvent: ActiveEvent;
  onFinishCallback: () => void;
  sessionId: string;
  event: Event;
  participantsNumber: number;
}

export const LiveEventContext = createContext<LiveEventDetailsProps>(
  {} as LiveEventDetailsProps
);

export default function LiveEventDetails({
  activeEvent,
  onFinishCallback,
  sessionId,
  event,
  participantsNumber,
}: LiveEventDetailsProps): ReactElement {
  return (
    <LiveEventContext.Provider
      value={{
        activeEvent,
        event,
        sessionId,
        onFinishCallback,
        participantsNumber,
      }}
    >
      {event.eventData.__typename === "Quiz" && <QuziLiveEventDetails />}
      {event.eventData.__typename === "Poll" && <PollLiveEventDetails />}
      {event.eventData.__typename === "Whiteboard" && (
        <WhiteboardLiveEventDetails />
      )}
    </LiveEventContext.Provider>
  );
}
