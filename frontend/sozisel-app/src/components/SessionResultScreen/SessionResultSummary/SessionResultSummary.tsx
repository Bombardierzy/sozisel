import "./SessionResultSummary.scss";

import { Paper } from "@material-ui/core";
import { ReactElement } from "react";
import SummaryDetails from "./SummaryDetails";

interface SessionResultSummaryProps {
  sessionId: string;
}

export default function SessionResultSummary({
  sessionId,
}: SessionResultSummaryProps): ReactElement {
  return (
    <div className="SessionResultSummary">
      <Paper className="paper" elevation={3}>
        {/* TODO: change me to some valid data when query is ready*/}
        <SummaryDetails
          date={"20.06.2021"}
          durationTime={120}
          participants={15}
          interactions={200}
        />
      </Paper>
    </div>
  );
}
