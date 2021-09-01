import "./LiveEventDetails.scss";

import React, { FC } from "react";

// eslint seems to have some problem with that, however it's not my code
// eslint-disable-next-line react/prop-types
const TextSection: FC<{ text: string }> = ({ children, text }) => (
  <span className="TextSection">
    {text}
    {children}
  </span>
);

export default TextSection;
