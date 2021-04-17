import "./Button.scss";

import React, { ReactElement } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  type: "button" | "submit" | "reset" | undefined;
}

export default function Button({
  name,
  type,
  ...props
}: ButtonProps): ReactElement {
  return (
    <button {...props} type={type} className="Button">
      {name}
    </button>
  );
}
