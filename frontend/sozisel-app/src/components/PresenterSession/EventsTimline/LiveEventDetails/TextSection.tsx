import "./LiveEventDetails.scss";
import React, { ReactElement } from "react";

interface TextSectionProps {
  children?: ReactElement;
  text: string;
}

const TextSection = ({ text, children }: TextSectionProps): ReactElement => (
  <span className="TextSection">
    {text}
    {children}
  </span>
);

export default TextSection;
