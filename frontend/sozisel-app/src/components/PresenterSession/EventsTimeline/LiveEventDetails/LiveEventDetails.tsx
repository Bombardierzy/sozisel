import "./LiveEventDetails.scss";

import {
  EventType,
  useGetEventTypename,
} from "../../../../hooks/useGetEventTypename";
import React, { ReactElement, createContext } from "react";

import { ActiveEvent } from "../EventsTimeline";
import { Event } from "../../../../model/Template";
import PollLiveEventDetails from "./PollLiveEventDetails/PollLiveEventDetails";
import QuziLiveEventDetails from "./QuizLiveEventDetails/QuizLiveEventDetails";
import WhiteboardLiveEventDetails from "./WhiteboardLiveEventDetails/WhiteboardLiveEventDetails";

// import placeholder

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
  const eventType = useGetEventTypename(event);
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
      {eventType === EventType.Quiz && <QuziLiveEventDetails />}
      {eventType === EventType.Poll && <PollLiveEventDetails />}
      {eventType === EventType.Whiteboard && <WhiteboardLiveEventDetails />}
      {/* placeholder for new module */}
    </LiveEventContext.Provider>
  );
}
