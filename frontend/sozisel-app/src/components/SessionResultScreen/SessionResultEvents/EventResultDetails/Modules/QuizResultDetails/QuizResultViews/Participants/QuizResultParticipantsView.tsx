import "./QuizResultParticipantsView.scss";

import { CircularProgress, Typography } from "@material-ui/core";

import EnhancedTable from "../../../../../../../utils/Table/Table";
import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { useQuizParticipantsSummaryQuery } from "../../../../../../../../graphql";
import { useTranslation } from "react-i18next";

export interface QuizResultParticpantsViewProps {
  id: string;
}
export default function QuizResultParticipantsView({
  id,
}: QuizResultParticpantsViewProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { loading, data } = useQuizParticipantsSummaryQuery({
    variables: { id },
  });

  if (loading) {
    return (
      <div className="QuizResultParticipantsView">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizParticipantsSummary) {
    return (
      <div className="QuizResultParticipantsView">
        <div className="headerWithIcon">
          <PeopleIcon color="primary" fontSize="large" />
          <Typography variant="h3" className="header">
            {t("components.SessionEventResults.Quiz.participants")}
          </Typography>
        </div>
        <EnhancedTable
          data={data.quizParticipantsSummary}
          headCells={[
            {
              id: "fullName",
              label: t("components.SessionEventResults.Quiz.name"),
            },
            {
              id: "numberOfPoints",
              label: t("components.SessionEventResults.Quiz.points"),
            },
            {
              id: "quizAnswerTime",
              label: t("components.SessionEventResults.Quiz.answerTime"),
            },
          ]}
          onClick={(a) => console.log(a)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="QuizResultParticipantsView">
        <ErrorAlert />
      </div>
    </>
  );
}
