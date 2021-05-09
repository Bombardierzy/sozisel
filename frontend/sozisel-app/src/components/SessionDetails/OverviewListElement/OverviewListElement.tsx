import "./OverviewListElement.scss";

import { ReactElement } from "react";
import { Typography } from "@material-ui/core";

export interface OverviewListElementProps {
  name: string;
  index: number;
  trailingText: string;
}

export default function OverviewListElement({
  name,
  index,
  trailingText,
}: OverviewListElementProps): ReactElement {
  return (
    <>
      <div className="OverviewListElement">
        <Typography className="elementText">
          {index.toString()}. {name}
        </Typography>
        <Typography className="elementText">{trailingText}</Typography>
      </div>
    </>
  );
}
