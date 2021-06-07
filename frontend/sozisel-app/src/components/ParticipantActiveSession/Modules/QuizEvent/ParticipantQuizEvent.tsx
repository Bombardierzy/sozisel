import "./ParticipantQuizEvent.scss";

import { Button, Paper, Typography } from "@material-ui/core";
import {
  ParticipantEvent,
  ParticipantQuiz,
  useSubmitQuizResultsMutation,
} from "../../../../graphql";
import { ReactElement, useEffect, useState } from "react";

import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import ParticipantQuizQuestion from "./ParticipantQuizQuestion/ParticipantQuizQuestion";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import { useParticipantQuizContext } from "../../../../contexts/ParticipantQuiz/ParticipantQuizContext";
import { useTranslation } from "react-i18next";

export interface ParticipantQuizEventProps {
  token: string;
  event: ParticipantEvent;
  onQuizFinished: () => void;
}

export default function ParticipantQuizEvent({
  token,
  event,
  onQuizFinished,
}: ParticipantQuizEventProps): ReactElement {
  const quiz = event.eventData as ParticipantQuiz;
  const { t } = useTranslation("common");
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [{ answers, currentAnswer }, dispatch] = useParticipantQuizContext();
  const [submitMutation] = useSubmitQuizResultsMutation();

  const submit = () => {
    const finalAnswers = [...answers, currentAnswer];
    if (!quiz.trackingMode) {
      finalAnswers.forEach((element) => (element.trackNodes = null));
    }
    // right now quiz is mocked so submitMutation will return error
    // situation'll change when event subscription will be added
    submitMutation({
      variables: {
        token: token,
        input: {
          launchedEventId: event.id,
          participantAnswers: finalAnswers,
        },
      },
    });
    onQuizFinished();
  };

  const countdownTimer = useCountdownTimer({
    startValue: quiz.durationTimeSec,
    onFinishCallback: submit,
  });

  const onNext = () => {
    if (questionNumber + 1 === quiz.quizQuestions.length) {
      submit();
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
        <Typography variant="h5">{countdownTimer}</Typography>
        <Button variant="contained" color="primary" onClick={onNext}>
          {t("components.ParticipantActiveSession.next")}
        </Button>
      </div>
    </Paper>
  );
}
