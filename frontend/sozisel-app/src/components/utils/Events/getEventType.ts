import { EventType } from "../../../graphql";

export function getEventTypeName(eventType: EventType): string {
  switch (eventType) {
    case "QUIZ":
      return "Quiz";
    case "POLL":
      return "Ankieta";
    case "WHITEBOARD":
      return "Tablica";
    default:
      return "";
  }
}
