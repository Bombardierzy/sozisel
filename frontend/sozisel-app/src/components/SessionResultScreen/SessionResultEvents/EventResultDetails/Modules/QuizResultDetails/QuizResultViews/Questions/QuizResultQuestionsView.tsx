import "./QuizResultQuestionView.scss";

import { CircularProgress, Typography } from "@material-ui/core";

import AssignmentIcon from "@material-ui/icons/Assignment";
import EnhancedTable from "../../../../../../../utils/Table/Table";
import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import React from "react";
import { useQuizQuestionsSummaryQuery } from "../../../../../../../../graphql";
import { useTranslation } from "react-i18next";

export interface QuizResultQuestionViewProps {
  id: string;
}
export default function QuizResultQuestionView({
  id,
}: QuizResultQuestionViewProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { loading, data } = useQuizQuestionsSummaryQuery({ variables: { id } });

  if (loading) {
    return (
      <div className="QuizResultQuestionView">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizQuestionsSummary) {
    return (
      <div className="QuizResultQuestionView">
        <div className="headerWithIcon">
          <AssignmentIcon color="primary" fontSize="large" />
          <Typography variant="h3" className="header">
            {t("components.SessionEventResults.Quiz.questions")}
          </Typography>
        </div>
        <EnhancedTable
          data={data.quizQuestionsSummary}
          headCells={[
            {
              id: "question",
              label: t("components.SessionEventResults.Quiz.question"),
            },
            {
              id: "averagePoint",
              label: t("components.SessionEventResults.Quiz.averagePoints"),
            },
            {
              id: "averageAnswerTime",
              label: t("components.SessionEventResults.Quiz.averageAnswerTime"),
            },
          ]}
          onClick={(a) => console.log(a)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="QuizResultQuestionView">
        <ErrorAlert />
      </div>
    </>
  );
}
