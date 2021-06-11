import React, { ReactNode, useReducer } from "react";
import participantQuizReducer, {
  ParticipantQuizActions,
  ParticipantQuizStoreInterface,
  participantQuizInitialState,
} from "./ParticipantQuizReducer";

interface Props {
  children: ReactNode;
}

export type ParticipantQuizContextType = [
  ParticipantQuizStoreInterface,
  React.Dispatch<ParticipantQuizActions>
];

export const Context = React.createContext<ParticipantQuizContextType>([
  participantQuizInitialState(),
  () => null,
]);

export let dispatchToParticipantQuiz: React.Dispatch<ParticipantQuizActions> = () =>
  null;

export function ParticipantQuizContextProvider({
  children,
}: Props): JSX.Element {
  const [store, dispatch] = useReducer(
    participantQuizReducer,
    participantQuizInitialState()
  );
  dispatchToParticipantQuiz = dispatch;

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
}

export function useParticipantQuizContext(): ParticipantQuizContextType {
  return React.useContext(Context);
}
