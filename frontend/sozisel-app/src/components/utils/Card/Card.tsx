import "./Card.scss";

import { ReactElement } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
}

export default function Card({ children, ...props }: CardProps): ReactElement {
  return (
    <div {...props} className="Card">
      {children}
    </div>
  );
}
