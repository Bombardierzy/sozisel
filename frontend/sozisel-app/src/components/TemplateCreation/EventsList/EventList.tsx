import "./EventsList.scss";

import React, { ReactElement } from "react";

import { Event } from "../../../model/Template";
import { Paper } from "@material-ui/core";

interface EventListProps {
  events?: Event[];
}

export default function EventList({ events }: EventListProps): ReactElement {
  console.log(events);
  return (
    <Paper className="ModuleList" elevation={2}>
      {events &&
        events.map((event: Event) => <p key={event.id}>{event.name}</p>)}
    </Paper>
  );
}
