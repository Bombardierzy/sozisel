import "./EventsList.scss";

import React, { ReactElement, useCallback, useMemo } from "react";

import { Event } from "../../../model/Template";
import EventListElement from "./EventsListElement/EventListElement";
import ShadowBoxCard from "../../utils/Card/ShadowBoxCard";
import { useDeleteEventMutation } from "../../../graphql";

interface EventListProps {
  events?: Event[];
}

export default function EventList({ events }: EventListProps): ReactElement {
  const [deleteEventMutation] = useDeleteEventMutation({
    refetchQueries: ["SessionTemplate"],
  });

  const sortedEvents = useMemo(() => {
    if (events) {
      return [...events].sort((a, b) => a.startMinute - b.startMinute);
    }

    return [];
  }, [events]);

  const onDelete = useCallback(
    (id) => {
      return deleteEventMutation({ variables: { id } });
    },
    [deleteEventMutation]
  );

  return (
    <div className="EventList">
      <ShadowBoxCard>
        <>
          {sortedEvents.map((event: Event) => (
            <EventListElement
              key={event.id}
              event={event}
              onDelete={onDelete}
            />
          ))}
        </>
      </ShadowBoxCard>
    </div>
  );
}
