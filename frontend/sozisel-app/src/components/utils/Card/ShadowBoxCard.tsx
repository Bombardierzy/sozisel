import "./ShadowBoxCard.scss";

import { ReactElement } from "react";

interface ShadowBoxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  hover?: boolean;
  disableScroll?: boolean;
}

export default function ShadowBoxCard({
  children,
  hover,
  disableScroll,
  ...props
}: ShadowBoxCardProps): ReactElement {
  const classNames = `Card ${hover ? "CardHover" : ""} ${
    disableScroll ? "CardNoScroll" : ""
  }`;
  return (
    <div {...props} className={classNames}>
      {children}
    </div>
  );
}
