import { Event, EventData } from "../../model/Template";

export type EventActions =
  | { type: "SET_EVENT"; event: Event }
  | { type: "RESET" };

export const initialEvent = {
  id: "",
  name: "Nazwa wydarzenia",
  durationTimeSec: 120,
  startMinute: 0,
  eventData: {} as EventData,
};

export const eventInitialState: Event = initialEvent;

export default function EventReducer(
  state: Event = eventInitialState,
  action: EventActions
): Event {
  switch (action.type) {
    case "SET_EVENT":
      return {
        ...action.event,
      };
    case "RESET":
      return initialEvent;
    default:
      return state;
  }
}
