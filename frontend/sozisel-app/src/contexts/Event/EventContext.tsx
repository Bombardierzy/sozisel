import EventReducer, { EventActions, eventInitialState } from "./eventReducer";
import React, { ReactNode, useReducer } from "react";

import { Event } from "../../model/Template";

interface Props {
  children: ReactNode;
}

export type EventContextType = [Event, React.Dispatch<EventActions>];

export const Context = React.createContext<EventContextType>([
  eventInitialState,
  () => null,
]);

export let dispatchToApp: React.Dispatch<EventActions> = () => null;

export function EventContextProvider({ children }: Props): JSX.Element {
  const [store, dispatch] = useReducer(EventReducer, eventInitialState);
  dispatchToApp = dispatch;

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
}

export function useEventContext(): EventContextType {
  return React.useContext(Context);
}
