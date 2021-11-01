import { Event } from "../model/Template";
import { ParticipantEvent } from "../graphql";

export enum EventType {
  Whiteboard = "Whiteboard",
  Poll = "Poll",
  Quiz = "Quiz",
  ParticipantQuiz = "ParticipantQuiz",
  // placeholder for new module
}

export const useGetEventTypename = (
  event: Event | ParticipantEvent
): EventType | undefined => {
  if (event && event.eventData && event.eventData.__typename) {
    return EventType[event.eventData.__typename];
  }

  return undefined;
};
