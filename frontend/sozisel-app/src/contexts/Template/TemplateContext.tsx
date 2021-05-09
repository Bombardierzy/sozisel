import React, { ReactElement } from "react";

interface TemplateContextProps {
  children: ReactElement;
  id: string;
}

const initialState = {
  id: "",
};

export const TemplateContext = React.createContext(initialState);

export default function TemplateContextProvider({
  children,
  id,
}: TemplateContextProps): ReactElement {
  return (
    <TemplateContext.Provider value={{ id }}>
      {children}
    </TemplateContext.Provider>
  );
}
