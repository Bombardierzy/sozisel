import "./LiveEventDetails.scss";
import React, { ReactElement } from "react";

interface TitleProps {
  children?: ReactElement;
  title: string;
}

const Title = ({ title, children }: TitleProps): ReactElement => (
  <span className="Title">
    {title}
    {children}
  </span>
);

export default Title;
