import "./QuizResultParticipantsView.scss";

import { CircularProgress, Typography } from "@material-ui/core";
import {
  QuizParticipantSummary,
  useQuizParticipantsSummaryQuery,
} from "../../../../../../../../graphql";
import React, { useState } from "react";

import EnhancedTable from "../../../../../../../utils/Table/Table";
import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import QuizResultDetailsDialog from "../DialogUtils/QuizResultDetailsDialog";
import { useTranslation } from "react-i18next";

export interface QuizResultParticpantsViewProps {
  id: string;
}
export default function QuizResultParticipantsView({
  id,
}: QuizResultParticpantsViewProps): React.ReactElement {
  const { t } = useTranslation("common");
  const [currentParticipant, setCurrentParticipant] =
    useState<QuizParticipantSummary | null>(null);
  const { loading, data } = useQuizParticipantsSummaryQuery({
    variables: { id },
  });

  const getParticipantStats = () => {
    return [
      {
        label: "Liczba punktów",
        value: `${currentParticipant?.numberOfPoints}`,
      },
      {
        label: "Czas odpowiediz",
        value: `${currentParticipant?.quizAnswerTime}`,
      },
    ];
  };

  if (loading) {
    return (
      <div className="QuizResultParticipantsView">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizParticipantsSummary) {
    return (
      <>
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
            onClick={(participant) => {
              setCurrentParticipant(participant);
            }}
          />
        </div>
        {currentParticipant !== null && (
          <QuizResultDetailsDialog
            isOpen={currentParticipant !== null}
            handleClose={() => setCurrentParticipant(null)}
            title={"Szczegóły uczestnika"}
            detailName={currentParticipant.fullName}
            detailIcon={<PersonIcon color="primary" fontSize="large" />}
            stats={getParticipantStats()}
          />
        )}
      </>
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
