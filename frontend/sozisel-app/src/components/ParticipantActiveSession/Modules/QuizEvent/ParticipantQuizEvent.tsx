import "./ParticipantQuizEvent.scss";

import { Button, Paper, Typography } from "@material-ui/core";

import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import { ReactElement } from "react";

export default function ParticipantQuizEvent(): ReactElement {
  const quizAnswer = (isSelected: boolean, text: string) => {
    return (
      <div className="quizAnswer">
        <Button variant="outlined" color={isSelected ? "primary" : "default"}>
          {text}
        </Button>
      </div>
    );
  };
  return (
    <Paper className="ParticipantQuizEvent" elevation={2}>
      <div className="header">
        <Typography variant="h5" className="headerText">
          <EventOutlinedIcon className="eventIcon" />
          Quiz na rozgrzewkę
        </Typography>
        <Typography variant="h5">1/4</Typography>
      </div>
      <Typography variant="h6" className="quizQuestion">
        Kto był królem Polski?
      </Typography>
      <div className="answerList">
        {quizAnswer(false, "Andrzej Duda")}
        {quizAnswer(true, "Mieszko 2")}
        {quizAnswer(false, "JP2")}
      </div>
      <div className="submitRow">
        <Typography variant="h5">00:30</Typography>
        <Button variant="contained" color="primary">
          Dalej
        </Button>
      </div>
    </Paper>
  );
}
