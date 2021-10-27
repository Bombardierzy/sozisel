import React, { ReactElement, ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

type ContextType = [
  showWhiteboard: boolean,
  setShowWhiteboard: (showWhiteboard: boolean) => void
];

export const Context = React.createContext<ContextType>([false, () => null]);

const ParticipantWhiteboardContext = ({ children }: Props): ReactElement => {
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);

  return (
    <Context.Provider value={[showWhiteboard, setShowWhiteboard]}>
      {children}
    </Context.Provider>
  );
};

export default ParticipantWhiteboardContext;
