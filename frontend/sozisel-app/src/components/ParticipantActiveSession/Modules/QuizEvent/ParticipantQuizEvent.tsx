import "./ParticipantQuizEvent.scss";

import { Paper, Typography } from "@material-ui/core";

import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import { ReactElement } from "react";

export default function ParticipantQuizEvent(): ReactElement {
  return (
    <Paper className="ParticipantQuizEvent" elevation={2}>
      <div className="header">
        <Typography variant="h5" className="headerText">
          <EventOutlinedIcon className="eventIcon" />
          Quiz na rozgrzewkę
        </Typography>
        <Typography variant="h5">1/4</Typography>
      </div>
    </Paper>
  );
}
