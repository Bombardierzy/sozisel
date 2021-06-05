import "./ParticipantQuizEvent.scss";

import { Button, Paper, Typography } from "@material-ui/core";
import { ParticipantEvent, ParticipantQuiz } from "../../../../graphql";
import { ReactElement, useEffect, useState } from "react";

import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import ParticipantQuizQuestion from "./ParticipantQuizQuestion/ParticipantQuizQuestion";
import { useParticipantQuizContext } from "../../../../contexts/ParticipantQuiz/ParticipantQuizContext";
import { useTranslation } from "react-i18next";

export interface ParticipantQuizEventProps {
  token: string;
  event: ParticipantEvent;
}

export default function ParticipantQuizEvent({
  token,
  event,
}: ParticipantQuizEventProps): ReactElement {
  const quiz = event.eventData as ParticipantQuiz;
  const { t } = useTranslation("common");
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [{ answers, currentAnswer }, dispatch] = useParticipantQuizContext();

  const onNext = () => {
    if (questionNumber + 1 === quiz.quizQuestions.length) {
      const finalAnswers = [...answers, currentAnswer];
      console.log(finalAnswers);
      //TODO add submit quiz result mutation
    } else {
      dispatch({
        type: "NEXT_QUESTION",
        question: quiz.quizQuestions[questionNumber + 1],
      });
      setQuestionNumber(questionNumber + 1);
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_QUESTION", question: quiz.quizQuestions[0] });
  }, [dispatch, quiz]);

  return (
    <Paper className="ParticipantQuizEvent" elevation={2}>
      <div className="header">
        <Typography variant="h5" className="headerText">
          <EventOutlinedIcon className="eventIcon" />
          {event.name}
        </Typography>
        <Typography variant="h5">
          {questionNumber + 1}/{quiz.quizQuestions.length}
        </Typography>
      </div>
      <ParticipantQuizQuestion />
      <div className="submitRow">
        <Typography variant="h5">00:30</Typography>
        <Button variant="contained" color="primary" onClick={onNext}>
          {t("components.ParticipantActiveSession.next")}
        </Button>
      </div>
    </Paper>
  );
}
