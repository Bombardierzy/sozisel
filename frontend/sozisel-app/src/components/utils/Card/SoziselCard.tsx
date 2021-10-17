import "./SoziselCard.scss";

import { ReactElement } from "react";

interface SoziselCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  hover?: boolean;
}

export default function SoziselCard({
  children,
  hover,
  ...props
}: SoziselCardProps): ReactElement {
  const classNames = `Card ${hover ? "CardHover" : ""}`;
  return (
    <div {...props} className={classNames}>
      {children}
    </div>
  );
}
