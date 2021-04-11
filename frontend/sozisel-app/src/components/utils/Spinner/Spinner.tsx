import "./Spinner.scss";

import React, { ReactElement } from "react";

export default function Spinner({
  ...props
}: React.HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div {...props} className="loader">
      Loading...
    </div>
  );
}
