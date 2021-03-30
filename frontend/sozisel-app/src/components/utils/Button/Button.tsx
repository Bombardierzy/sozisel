import "./button.scss";

import { ReactElement } from "react";

interface ButtonProps {
  name: string;
  type: "button" | "submit" | "reset" | undefined;
}

export default function Button({ name, type }: ButtonProps): ReactElement {
  return <button type={type}>{name}</button>;
}
