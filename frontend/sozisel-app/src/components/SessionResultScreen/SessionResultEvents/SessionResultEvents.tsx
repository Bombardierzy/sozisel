import "./SessionResultEvents.scss";

import EventCard, { MockEvent } from "./EventCard/EventCard";

import { List } from "@material-ui/core";
import { ReactElement } from "react";

interface SessionResultEventsProps {
  sessionId: string;
}

export default function SessionResultEvents({
  sessionId,
}: SessionResultEventsProps): ReactElement {
  const events: MockEvent[] = [{ name: "event", id: "adsdf", startMinute: 12 }];
  return (
    <>
      <div className="SessionResultEvents">
        <List>
          {events.map((element, _) => (
            <EventCard key={element.id} event={element} />
          ))}
        </List>
      </div>
    </>
  );
}
