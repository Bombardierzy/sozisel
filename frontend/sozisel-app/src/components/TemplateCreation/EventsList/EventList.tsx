import "./EventsList.scss";

import React, { ReactElement } from "react";

import { Event } from "../../../model/Template";
import { Paper } from "@material-ui/core";
import Quiz from "./EventsListElement/Quiz/QuizEvent";

interface EventListProps {
  events?: Event[];
}

export default function EventList({ events }: EventListProps): ReactElement {
  return (
    <Paper className="EventList" elevation={2}>
      {events &&
        [...events]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((event: Event) => {
            switch (event.eventData.__typename) {
              case "Quiz":
                return <Quiz key={event.id} event={event} />;
              default:
                return <></>;
            }
          })}
    </Paper>
  );
}
