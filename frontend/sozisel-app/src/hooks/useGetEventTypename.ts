import { Event } from "../model/Template";

export enum EventType {
  Whiteboard = "Whiteboard",
  Poll = "Poll",
  Quiz = "Quiz",
}

type EventTypename = "Whiteboard" | "Poll" | "Quiz";

export const useGetEventTypename = (event: Event): EventType | undefined => {
  if (event.eventData.__typename) {
    return EventType[event.eventData.__typename];
  }

  return undefined;
};

export const useCheckEventTypename = (
  event: Event,
  typename: EventTypename
): boolean => {
  if (event.eventData.__typename) {
    return EventType[event.eventData.__typename] === EventType[typename];
  }

  return false;
};
