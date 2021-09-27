import "./PollResultDetails.scss";

import { CircularProgress, Paper, Typography } from "@material-ui/core";

import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import React from "react";
import StatsRow from "../../../../../utils/StatsRow/StatsRow";
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
              label={"Liczba uczestników"}
              value={`${data.pollSummary.totalVoters}`}
            />
          }
          {
            <StatsRow
              label={"Wielokrotny wybór"}
              value={`${data.pollSummary.isMultiChoice ? "Tak" : "Nie"}`}
            />
          }
          <Typography className="answersLabel">Liczba odpowiedzi</Typography>
          {data.pollSummary.optionSummaries.map((option) => (
            <StatsRow
              key={option.id}
              label={option.text}
              value={`${option.votes}`}
            />
          ))}
        </Paper>
        <Paper className="pollResultView" elevation={2}></Paper>
      </div>
    );
  }

  return (
    <div className="PollResultDetails">
      <ErrorAlert />
    </div>
  );
}
