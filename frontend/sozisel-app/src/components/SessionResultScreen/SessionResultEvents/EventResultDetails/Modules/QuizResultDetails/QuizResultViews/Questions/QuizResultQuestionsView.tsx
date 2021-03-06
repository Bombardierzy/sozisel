import "./QuizResultQuestionView.scss";

import { CircularProgress, Typography } from "@material-ui/core";
import {
  ParticipantAnswer,
  QuizQuestionSummary,
  useQuizQuestionsSummaryQuery,
} from "../../../../../../../../graphql";
import QuizResultDetailsDialog, {
  QuizResultDialogDetails,
} from "../DialogUtils/QuizResultDetailsDialog";
import { ReactElement, useCallback, useMemo, useState } from "react";

import AssignmentIcon from "@material-ui/icons/Assignment";
import EnhancedTable from "../../../../../../../utils/Table/Table";
import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import { ensure } from "../../../../../../../utils/Typescript/ensure";
import { useTranslation } from "react-i18next";

export interface QuizResultQuestionViewProps {
  id: string;
}
export default function QuizResultQuestionView({
  id,
}: QuizResultQuestionViewProps): ReactElement {
  const { t } = useTranslation("common");
  const { loading, data } = useQuizQuestionsSummaryQuery({ variables: { id } });
  const [currentQuestion, setCurrentQuestion] =
    useState<QuizQuestionSummary | null>(null);

  const questionStats = [
    {
      label: t("components.SessionEventResults.Quiz.averagePoints"),
      value: `${currentQuestion?.averagePoint.toFixed(2)}`,
    },
    {
      label: t("components.SessionEventResults.Quiz.averageAnswerTime"),
      value: `${currentQuestion?.averageAnswerTime.toFixed(2)}`,
    },
  ];

  const headCells: {
    id: keyof QuizQuestionSummary;
    label: string;
  }[] = [
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
  ];

  const getDialogDetails = useCallback(
    (answer: ParticipantAnswer): QuizResultDialogDetails => {
      return {
        name: answer.fullName,
        points: answer.points,
        answerTime: answer.answerTime,
        finalAnswers: answer.finalAnswerIds.map(
          (answerId) =>
            ensure(
              currentQuestion?.answers.find(
                (element) => element.id === answerId
              )
            ).text
        ),
        trackNodes: answer.trackNodes.map((trackNode) => {
          return {
            answer: ensure(
              currentQuestion?.answers.find(
                (element) => element.id === trackNode.answerId
              )
            ).text,
            time: trackNode.reactionTime,
            action: trackNode.selected
              ? t("components.SessionEventResults.Quiz.dialog.selection")
              : t("components.SessionEventResults.Quiz.dialog.unSelection"),
          };
        }),
      };
    },
    [currentQuestion, t]
  );

  const chartData = useMemo(() => {
    return (currentQuestion?.participantsAnswers ?? []).map((answer) => {
      return {
        xLabel: answer.fullName,
        value: answer.points,
      };
    });
  }, [currentQuestion]);

  const dialogDetails = useMemo(() => {
    return (currentQuestion?.participantsAnswers ?? []).map((answer) =>
      getDialogDetails(answer)
    );
  }, [currentQuestion, getDialogDetails]);

  if (loading) {
    return (
      <div className="QuizResultQuestionView">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizQuestionsSummary) {
    return (
      <>
        <div className="QuizResultQuestionView">
          <div className="headerWithIcon">
            <AssignmentIcon color="primary" fontSize="large" />
            <Typography variant="h3" className="header">
              {t("components.SessionEventResults.Quiz.questions")}
            </Typography>
          </div>
          <EnhancedTable
            data={data.quizQuestionsSummary}
            headCells={headCells}
            onClick={setCurrentQuestion}
          />
        </div>

        <QuizResultDetailsDialog
          isOpen={currentQuestion !== null}
          handleClose={() => setCurrentQuestion(null)}
          title={t("components.SessionEventResults.Quiz.questionDetails")}
          detailName={currentQuestion?.question ?? ""}
          detailIcon={<AssignmentIcon color="primary" fontSize="large" />}
          stats={questionStats}
          detailsViewTitle={t(
            "components.SessionEventResults.Quiz.resultForParticipants"
          )}
          chartData={chartData}
          chartSubtitle={t(
            "components.SessionEventResults.Quiz.forParticipants"
          )}
          details={dialogDetails}
        />
      </>
    );
  }

  return (
    <div className="QuizResultQuestionView">
      <ErrorAlert />
    </div>
  );
}
