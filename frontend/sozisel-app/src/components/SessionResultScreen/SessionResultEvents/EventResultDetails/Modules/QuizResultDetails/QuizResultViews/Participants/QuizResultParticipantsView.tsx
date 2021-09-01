import "./QuizResultParticipantsView.scss";

import { CircularProgress, Typography } from "@material-ui/core";
import {
  QuizParticipantSummary,
  useQuizParticipantsSummaryQuery,
  useQuizQuestionsAndAnswersQuery,
} from "../../../../../../../../graphql";
import React, { useState } from "react";

import EnhancedTable from "../../../../../../../utils/Table/Table";
import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import QuizResultDetailsDialog from "../DialogUtils/QuizResultDetailsDialog";
import { ensure } from "../../../../../../../utils/Typescript/ensure";
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
  const { loading: questionsAndAnswersLoading, data: questionsAndAnswers } =
    useQuizQuestionsAndAnswersQuery({ variables: { id } });

  const participantsStats = [
    {
      label: t("components.SessionEventResults.Quiz.points"),
      value: `${currentParticipant?.numberOfPoints.toFixed(2)}`,
    },
    {
      label: t("components.SessionEventResults.Quiz.answerTime"),
      value: `${currentParticipant?.quizAnswerTime.toFixed(2)}`,
    },
  ];

  const headCells: {
    id: keyof QuizParticipantSummary;
    label: string;
  }[] = [
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
  ];

  if (loading || questionsAndAnswersLoading) {
    return (
      <div className="QuizResultParticipantsView">
        <CircularProgress />
      </div>
    );
  }

  if (
    data?.quizParticipantsSummary &&
    questionsAndAnswers?.quizQuestionsSummary
  ) {
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
            headCells={headCells}
            onClick={(participant) => {
              setCurrentParticipant(participant);
            }}
          />
        </div>

        <QuizResultDetailsDialog
          isOpen={currentParticipant !== null}
          handleClose={() => setCurrentParticipant(null)}
          title={t("components.SessionEventResults.Quiz.participantDetails")}
          detailName={currentParticipant?.fullName ?? ""}
          detailIcon={<PersonIcon color="primary" fontSize="large" />}
          stats={participantsStats}
          detailsViewTitle={t(
            "components.SessionEventResults.Quiz.resultForQuestions"
          )}
          chartData={(currentParticipant?.participantAnswers ?? []).map(
            (answer) => {
              const question = ensure(
                questionsAndAnswers.quizQuestionsSummary.find(
                  (element) => element.questionId === answer.questionId
                )
              );
              return {
                xLabel: question.question,
                value: answer.points,
              };
            }
          )}
          chartSubtitle={t("components.SessionEventResults.Quiz.forQuestions")}
          details={(currentParticipant?.participantAnswers ?? []).map(
            (answer) => {
              const question = ensure(
                questionsAndAnswers.quizQuestionsSummary.find(
                  (element) => element.questionId === answer.questionId
                )
              );
              return {
                name: question.question,
                points: answer.points,
                answerTime: answer.answerTime,
                finalAnswers: answer.finalAnswerIds.map(
                  (answerId) =>
                    ensure(
                      question.answers.find(
                        (element) => element.id === answerId
                      )
                    ).text
                ),
                trackNodes: answer.trackNodes.map((trackNode) => {
                  return {
                    answer: ensure(
                      question.answers.find(
                        (element) => element.id === trackNode.answerId
                      )
                    ).text,
                    time: trackNode.reactionTime,
                    action: trackNode.selected
                      ? t(
                          "components.SessionEventResults.Quiz.dialog.selection"
                        )
                      : t(
                          "components.SessionEventResults.Quiz.dialog.unSelection"
                        ),
                  };
                }),
              };
            }
          )}
        />
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
