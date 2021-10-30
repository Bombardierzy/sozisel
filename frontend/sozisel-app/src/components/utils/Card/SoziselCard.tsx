import "./SoziselCard.scss";

import { ReactElement } from "react";

interface SoziselCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  hover?: boolean;
  disableScroll?: boolean;
}

export default function SoziselCard({
  children,
  hover,
  disableScroll,
  ...props
}: SoziselCardProps): ReactElement {
  const classNames = `Card ${hover ? "CardHover" : ""} ${
    disableScroll ? "CardNoScroll" : ""
  }`;
  return (
    <div {...props} className={classNames}>
      {children}
    </div>
  );
}
