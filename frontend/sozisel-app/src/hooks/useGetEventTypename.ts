import { Event } from "../model/Template";
import { ParticipantEvent } from "../graphql";

export enum EventType {
  Whiteboard = "Whiteboard",
  Poll = "Poll",
  Quiz = "Quiz",
  ParticipantQuiz = "ParticipantQuiz",
}

type EventTypename = "Whiteboard" | "Poll" | "Quiz" | "ParticipantQuiz";

export const useGetEventTypename = (
  event: Event | ParticipantEvent
): EventType | undefined => {
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
