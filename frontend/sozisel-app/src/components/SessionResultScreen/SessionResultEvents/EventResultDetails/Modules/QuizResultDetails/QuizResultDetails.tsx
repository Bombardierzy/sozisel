import "./QuizResultDetails.scss";

import { CircularProgress, Paper, Typography } from "@material-ui/core";

import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import React from "react";
import { useQuizSummaryQuery } from "../../../../../../graphql";

export interface QuizResultDetailsProps {
  id: string;
  eventName: string;
}

export default function QuizResultDetails({
  id,
  eventName,
}: QuizResultDetailsProps): React.ReactElement {
  const { data, loading, error } = useQuizSummaryQuery({ variables: { id } });

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
        </Paper>
        <Paper className="quizResultView" elevation={2}>
          result view{" "}
        </Paper>
      </div>
    );
  }

  console.log(error);

  return (
    <>
      <div className="QuizResultDetails">
        <ErrorAlert />
      </div>
    </>
  );
}
