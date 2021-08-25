import "./LiveEventDetails.scss";

import React, { ReactElement, createContext } from "react";

import { ActiveEvent } from "../EventsTimeline";
import { Event } from "../../../../model/Template";
import QuziLiveEventDetails from "./QuizLiveEventDetails/QuizLiveEventDetails";

interface LiveEventDetailsProps {
  activeEvent: ActiveEvent;
  onFinishCallback: () => void;
  sessionId: string;
  event: Event;
}

export const LiveEventContext = createContext<LiveEventDetailsProps>(
  {} as LiveEventDetailsProps
);

export default function LiveEventDetails({
  activeEvent,
  onFinishCallback,
  sessionId,
  event,
}: LiveEventDetailsProps): ReactElement {


  return (
    <LiveEventContext.Provider
      value={{ activeEvent, event, sessionId, onFinishCallback }}
    >
        {
          event.eventData.__typename === 'Quiz' && <QuziLiveEventDetails />
        }
    </LiveEventContext.Provider>
  );
}
