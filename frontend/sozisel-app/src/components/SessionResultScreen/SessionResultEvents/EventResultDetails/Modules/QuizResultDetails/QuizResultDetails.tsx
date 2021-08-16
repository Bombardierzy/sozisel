import "./QuizResultDetails.scss";

import { CircularProgress, Paper } from "@material-ui/core";

import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import React from "react";
import { useQuizSummaryQuery } from "../../../../../../graphql";

export interface QuizResultDetailsProps {
  id: string;
}

export default function QuizResultDetails({
  id,
}: QuizResultDetailsProps): React.ReactElement {
  const { data, loading, error } = useQuizSummaryQuery({ variables: { id } });

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
          summary
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
