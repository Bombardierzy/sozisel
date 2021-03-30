import "./button.scss";

import { ReactElement } from "react";

interface ButtonProps {
  name: string;
}

export default function Button({ name }: ButtonProps): ReactElement {
  return <button>{name}</button>;
}
