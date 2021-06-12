import "./PresenterSession.scss";

import { CircularProgress, Grid, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";

import ActiveSessionAgenda from "./ActiveSessionAgenda/ActiveSessionAgenda";
import { Alert } from "@material-ui/lab";
import EventsTimeline from "./EventsTimline/EventsTimeline";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import moment from "moment-timezone";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useParams } from "react-router";
import { useSessionDetailsQuery } from "../../graphql";
import useSessionParticipantType from "../../hooks/useSessionParticipantType";
import { useTranslation } from "react-i18next";

export default function PresenterSession(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const { token, type } = useSessionParticipantType();
  const {
    participants,
    error: getParticipantsError,
    loading: getParticipantsLoading,
  } = useLiveSessionParticipation({
    sessionId: id,
    type,
    token,
  });

  const { data, loading, error } = useSessionDetailsQuery({
    variables: {
      id,
    },
  });

  if (loading) {
    return (
      <div className="PresenterSession">
        <MainNavbar />
        <CircularProgress className="progressIndicator" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="PresenterSession">
        <MainNavbar />
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.PresenterSession.fetchingError")}
        </Alert>
      </div>
    );
  }

  return (
    <div className="PresenterSession">
      <MainNavbar />
      <Grid container spacing={1} className="containerGrid">
        <Grid item xs={3} className="firstRowItem">
          {data && data.session && (
            <ActiveSessionAgenda
              agendaEntries={data.session.sessionTemplate.agendaEntries}
              estimatedTimeInSeconds={
                data.session.sessionTemplate.estimatedTime
              }
              sessionStartDate={new Date(data.session.startTime)}
            />
          )}
        </Grid>
        <Grid item xs={6} className="firstRowItem">
          <Paper elevation={2}></Paper>
        </Grid>
        <Grid item xs={3} className="firstRowItem">
          {data && data.session && (
            <ParticipantsList
              error={getParticipantsError}
              loading={getParticipantsLoading}
              participants={participants}
            />
          )}
        </Grid>
        <Grid item xs={12} className="secondRowItem">
          {data && data.session && (
            <EventsTimeline
              participants={participants.filter(
                (participant) => participant.type !== "presenter"
              )}
              sessionId={data.session.id}
              events={data.session.sessionTemplate.events}
              launchedEvents={data.session.launchedEvents
                .slice()
                .sort((a, b) =>
                  moment.utc(a.insertedAt).diff(moment.utc(b.insertedAt))
                )}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
