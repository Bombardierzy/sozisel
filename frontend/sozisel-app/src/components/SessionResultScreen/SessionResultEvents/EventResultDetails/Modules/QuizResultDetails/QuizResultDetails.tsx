import "./QuizResultDetails.scss";

import { Card, CircularProgress, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";

import AssignmentIcon from "@material-ui/icons/Assignment";
import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import PeopleIcon from "@material-ui/icons/People";
import QuizResultChartsView from "./QuizResultViews/Charts/QuizResultCharsView";
import QuizResultParticipantsView from "./QuizResultViews/Participants/QuizResultParticipantsView";
import QuizResultQuestionsView from "./QuizResultViews/Questions/QuizResultQuestionsView";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useQuizSummaryQuery } from "../../../../../../graphql";

export interface QuizResultDetailsProps {
  id: string;
  eventName: string;
}

enum QuizResultView {
  PARTICIPANTS,
  QUESTIONS,
  CHARTS,
}

export default function QuizResultDetails({
  id,
  eventName,
}: QuizResultDetailsProps): React.ReactElement {
  const { data, loading } = useQuizSummaryQuery({ variables: { id } });
  const [activeView, setActiveView] = useState<QuizResultView>(
    QuizResultView.PARTICIPANTS
  );
  const [raisedCard, setRaisedCard] = useState<QuizResultView | null>(null);

  const onMouseOverChange = (viewType: QuizResultView) => {
    setRaisedCard((prev) => (prev === viewType ? null : viewType));
  };

  const statsRow = (label: string, value: string) => {
    return (
      <div className="statsRow">
        <div className="statsRowLabel">{label}</div>
        <div className="statsRowValue">{value}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="QuizResultDetails">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizSummary) {
    return (
      <div className="QuizResultDetails">
        <Paper className="quizSummary" elevation={2}>
          <div className="headerWithIcon">
            <EventIcon color="primary" fontSize="large" />
            <Typography variant="h3" className="header">
              {eventName}
            </Typography>
          </div>
          {statsRow(
            "Średnia liczba punktów",
            `${data.quizSummary.averagePoints}`
          )}
          {statsRow(
            "Średni czas odpowiedzi",
            `${data.quizSummary.averageQuizAnswerTime}`
          )}
          {statsRow(
            "Liczba uczestników",
            `${data.quizSummary.numberOfParticipants}`
          )}
          <Typography className="chooseViewLabel">Wybierz widok</Typography>
          <Card
            raised={raisedCard === QuizResultView.PARTICIPANTS}
            onMouseOver={(_e) => onMouseOverChange(QuizResultView.PARTICIPANTS)}
            onMouseOut={(_e) => onMouseOverChange(QuizResultView.PARTICIPANTS)}
            onClick={() => setActiveView(QuizResultView.PARTICIPANTS)}
            className={
              "viewCard" +
              (activeView === QuizResultView.PARTICIPANTS ? " activeCard" : "")
            }
          >
            <PeopleIcon />
            Uczestnicy
          </Card>
          <Card
            raised={raisedCard === QuizResultView.QUESTIONS}
            onMouseOver={(_e) => onMouseOverChange(QuizResultView.QUESTIONS)}
            onMouseOut={(_e) => onMouseOverChange(QuizResultView.QUESTIONS)}
            onClick={() => setActiveView(QuizResultView.QUESTIONS)}
            className={
              "viewCard" +
              (activeView === QuizResultView.QUESTIONS ? " activeCard" : "")
            }
          >
            <AssignmentIcon />
            Pytania
          </Card>
          <Card
            raised={raisedCard === QuizResultView.CHARTS}
            onMouseOver={(_e) => onMouseOverChange(QuizResultView.CHARTS)}
            onMouseOut={(_e) => onMouseOverChange(QuizResultView.CHARTS)}
            onClick={() => setActiveView(QuizResultView.CHARTS)}
            className={
              "viewCard" +
              (activeView === QuizResultView.CHARTS ? " activeCard" : "")
            }
          >
            <TrendingUpIcon />
            Wykresy
          </Card>
        </Paper>
        <Paper className="quizResultView" elevation={2}>
          {activeView === QuizResultView.PARTICIPANTS && (
            <QuizResultParticipantsView />
          )}
          {activeView === QuizResultView.QUESTIONS && (
            <QuizResultQuestionsView />
          )}
          {activeView === QuizResultView.CHARTS && <QuizResultChartsView />}
        </Paper>
      </div>
    );
  }

  return (
    <>
      <div className="QuizResultDetails">
        <ErrorAlert />
      </div>
    </>
  );
}
