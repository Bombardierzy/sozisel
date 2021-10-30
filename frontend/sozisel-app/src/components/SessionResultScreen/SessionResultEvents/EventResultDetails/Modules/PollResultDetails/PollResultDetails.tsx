import "./PollResultDetails.scss";

import { CircularProgress, List, Typography } from "@material-ui/core";
import React, { useMemo } from "react";

import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import PollPieChart from "../../../../../utils/PollPieChart/PollPieChart";
import SoziselCard from "../../../../../utils/Card/SoziselCard";
import StatsRow from "../../../../../utils/StatsRow/StatsRow";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { usePollResultQuery } from "../../../../../../graphql";
import { useTranslation } from "react-i18next";

export interface PollResultDetailsProps {
  id: string;
  eventName: string;
}

export default function PollResultDetails({
  id,
  eventName,
}: PollResultDetailsProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { data, loading } = usePollResultQuery({ variables: { id } });

  const pollChartData = useMemo(() => {
    if (data?.pollSummary) {
      return data.pollSummary.optionSummaries.filter(
        (option) => option.votes > 0
      );
    }
    return [];
  }, [data]);

  if (loading) {
    return (
      <div className="PollResultDetails">
        <CircularProgress />
      </div>
    );
  }

  if (data?.pollSummary) {
    return (
      <div className="PollResultDetails">
        <div className="pollSummary">
          <SoziselCard>
            <div className="pollSummaryContent">
              <div className="headerWithIcon">
                <EventIcon color="primary" fontSize="large" />
                <Typography variant="h3" className="header">
                  {eventName}
                </Typography>
              </div>
              <Typography variant="h5" className="question">
                {data.pollSummary.question}
              </Typography>
              {
                <StatsRow
                  label={t(
                    "components.SessionEventResults.Poll.participantsNumber"
                  )}
                  value={`${data.pollSummary.totalVoters}`}
                />
              }
              {
                <StatsRow
                  label={t("components.SessionEventResults.Poll.multichoice")}
                  value={`${
                    data.pollSummary.isMultiChoice
                      ? t("components.SessionEventResults.Poll.yes")
                      : t("components.SessionEventResults.Poll.no")
                  }`}
                />
              }
              <Typography className="answersLabel">
                {t("components.SessionEventResults.Poll.answersNumber")}
              </Typography>
              <List className="answersList">
                {data.pollSummary.optionSummaries.map((option) => (
                  <StatsRow
                    key={option.id}
                    label={option.text}
                    value={`${option.votes}`}
                  />
                ))}
              </List>
            </div>
          </SoziselCard>
        </div>
        <div className="pollResultView">
          <SoziselCard>
            <div className="pollResultViewContent">
              <div className="pollResultHeader">
                <TrendingUpIcon color="primary" fontSize="large" />
                <Typography variant="h3" className="resultHeader">
                  {t("components.SessionEventResults.Quiz.charts")}
                </Typography>
              </div>
              <div className="pollPieChart">
                <PollPieChart outerRadius={150} data={pollChartData} />
              </div>
            </div>
          </SoziselCard>
        </div>
      </div>
    );
  }

  return (
    <div className="PollResultDetails">
      <ErrorAlert />
    </div>
  );
}
