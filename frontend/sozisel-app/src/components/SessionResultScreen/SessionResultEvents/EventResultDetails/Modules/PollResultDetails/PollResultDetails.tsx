import "./PollResultDetails.scss";

import { CircularProgress, List, Paper, Typography } from "@material-ui/core";

import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import PollPieChart from "../../../../../utils/PollPieChart/PollPieChart";
import React from "react";
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
        <Paper className="pollSummary" elevation={2}>
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
              value={`${data.pollSummary.isMultiChoice ? "Tak" : "Nie"}`}
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
        </Paper>
        <Paper className="pollResultView" elevation={2}>
          <div className="pollResultHeader">
            <TrendingUpIcon color="primary" fontSize="large" />
            <Typography variant="h3" className="resultHeader">
              {t("components.SessionEventResults.Quiz.charts")}
            </Typography>
          </div>
          <div className="pollPieChart">
            <PollPieChart
              outerRadius={150}
              data={data.pollSummary.optionSummaries.filter(
                (option) => option.votes > 0
              )}
            />
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="PollResultDetails">
      <ErrorAlert />
    </div>
  );
}
