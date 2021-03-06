import "./QuizResultChartsView.scss";

import { CircularProgress, Typography } from "@material-ui/core";
import React, { useMemo } from "react";

import ErrorAlert from "../../../../../../../utils/Alerts/ErrorAlert";
import TotalAreaChart from "../../../../../../SessionResultSummary/TotalAreaChart";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useQuizQuestionsSummaryQuery } from "../../../../../../../../graphql";
import { useTranslation } from "react-i18next";

export interface QuizResultChartsViewProps {
  id: string;
}
export default function QuizResultChartsView({
  id,
}: QuizResultChartsViewProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { loading, data } = useQuizQuestionsSummaryQuery({ variables: { id } });

  const pointsChartData = useMemo(() => {
    if (!data?.quizQuestionsSummary) return [];
    return data.quizQuestionsSummary.map((question) => {
      return {
        xLabel: question.question,
        value: question.averagePoint,
      };
    });
  }, [data]);

  const timesChartData = useMemo(() => {
    if (!data?.quizQuestionsSummary) return [];
    return data.quizQuestionsSummary.map((question) => {
      return {
        xLabel: question.question,
        value: question.averageAnswerTime,
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="QuizResultChartsView">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizQuestionsSummary) {
    return (
      <div className="QuizResultChartsView">
        <div className="headerWithIcon">
          <TrendingUpIcon color="primary" fontSize="large" />
          <Typography variant="h3" className="header">
            {t("components.SessionEventResults.Quiz.charts")}
          </Typography>
        </div>
        <div className="chartsContainer">
          <div className="chartContainer">
            <div>
              <h2>{t("components.SessionEventResults.Quiz.averagePoints")}</h2>
              <h3>{t("components.SessionEventResults.Quiz.forQuestions")}</h3>
            </div>

            <div className="chart">
              <TotalAreaChart
                data={pointsChartData}
                valueLabel={t("components.SessionEventResults.Quiz.points")}
              />
            </div>
          </div>
          <div className="chartContainer">
            <div>
              <h2>
                {t("components.SessionEventResults.Quiz.averageAnswerTime")}
              </h2>
              <h3>{t("components.SessionEventResults.Quiz.forQuestions")}</h3>
            </div>

            <div className="chart">
              <TotalAreaChart
                data={timesChartData}
                valueLabel={t("components.SessionEventResults.Quiz.answerTime")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="QuizResultChartsView">
        <ErrorAlert />
      </div>
    </>
  );
}
