import "./LiveEventDetails.scss";
import React, { FC } from "react";

const TextSection: FC<{ text: string }> = ({ children, text }) => (
  <span className="TextSection">
    {text}
    {children}
  </span>
);

export default TextSection;
