import React, { ReactNode, useReducer } from "react";
import quizReducer, {
  QuizActions,
  QuizStoreInterface,
  quizInitialState,
} from "./quizReducer";

interface Props {
  children: ReactNode;
}

export type QuizContextType = [QuizStoreInterface, React.Dispatch<QuizActions>];

export const Context = React.createContext<QuizContextType>([
  quizInitialState(),
  () => null,
]);

export let dispatchToQuiz: React.Dispatch<QuizActions> = () => null;

export function QuizContextProvider({ children }: Props): JSX.Element {
  const [store, dispatch] = useReducer(quizReducer, quizInitialState());
  dispatchToQuiz = dispatch;

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
}

export function useQuizContext(): QuizContextType {
  return React.useContext(Context);
}
