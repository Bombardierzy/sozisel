import "./EventsList.scss";

import React, { ReactElement, useCallback, useMemo } from "react";
import { useDeletePollMutation, useDeleteQuizMutation } from "../../../graphql";

import { Event } from "../../../model/Template";
import EventListElement from "./EventsListElement/EventListElement";
import SoziselCard from "../../utils/Card/SoziselCard";

interface EventListProps {
  events?: Event[];
}

export default function EventList({ events }: EventListProps): ReactElement {
  const [deleteQuizMutation] = useDeleteQuizMutation({
    refetchQueries: ["SessionTemplate"],
  });
  const [deletePollMutation] = useDeletePollMutation({
    refetchQueries: ["SessionTemplate"],
  });

  const sortedEvents = useMemo(() => {
    if (events) {
      return [...events].sort((a, b) => a.startMinute - b.startMinute);
    }

    return [];
  }, [events]);

  const onDelete = useCallback(
    (type: string) => {
      return (id: string) => {
        switch (type) {
          case "Quiz":
            return deleteQuizMutation({ variables: { id } });
          case "Poll":
            return deletePollMutation({ variables: { id } });
        }
      };
    },
    [deletePollMutation, deleteQuizMutation]
  );

  return (
    <div className="EventList">
      <SoziselCard>
        <>
          {sortedEvents.map((event: Event) => (
            <EventListElement
              key={event.id}
              event={event}
              onDelete={onDelete(event.eventData.__typename || "")}
            />
          ))}
        </>
      </SoziselCard>
    </div>
  );
}
