import "./AnnotationsPanel.scss";

import { Paper } from "@material-ui/core";
import { ReactElement } from "react";

export function AnnotationsPanel(props: any): ReactElement {
  return (
    <Paper
      className="AnnotationsPanel"
      classes={{ rounded: "AnnotationsPanelRounded" }}
      elevation={4}
    ></Paper>
  );
}
