import "./card.scss";

import { ReactElement } from "react";

interface CardProps {
  children?: ReactElement;
}

export default function Card({ children }: CardProps): ReactElement {
  return <div className="card">{children}</div>;
}
