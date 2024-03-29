import "./PresenterSession.scss";

import { CircularProgress, Grid } from "@material-ui/core";
import React, { ReactElement } from "react";
import {
  useGenerateJitsiTokenQuery,
  useMeQuery,
  useSessionDetailsQuery,
} from "../../graphql";

import ActiveSessionAgenda from "./ActiveSessionAgenda/ActiveSessionAgenda";
import { Alert } from "@material-ui/lab";
import EventsTimeline from "./EventsTimeline/EventsTimeline";
import JitsiFrame from "../Jitsi/JitsiFrame";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import { SessionMenu } from "../SessionMenu/SessionMenu";
import ShadowBoxCard from "../utils/Card/ShadowBoxCard";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useParams } from "react-router";
import useSessionParticipantType from "../../hooks/useSessionParticipantType";
import { useTranslation } from "react-i18next";

export default function PresenterSession(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const { token, type } = useSessionParticipantType();
  const { data: meData } = useMeQuery();
  const {
    participants,
    error: getParticipantsError,
    loading: getParticipantsLoading,
  } = useLiveSessionParticipation({
    sessionId: id,
    type,
    token,
  });

  const { data: jitsiData, loading: jitsiLoading } = useGenerateJitsiTokenQuery(
    {
      variables: {
        displayName: `${meData?.me.firstName} ${meData?.me.lastName}`,
        email: meData?.me.email || "",
        roomId: id,
      },
    }
  );

  const { data, loading, error } = useSessionDetailsQuery({
    variables: {
      id,
    },
  });

  const useJitsi = data && data.session && data.session.useJitsi;

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
        <Grid item xs={useJitsi ? 3 : 6} className="firstRowItem">
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
        {useJitsi && (
          <Grid item xs={6} className="firstRowItem jitsiFrame">
            <ShadowBoxCard>
              <div>
                {!jitsiLoading && jitsiData?.generateJitsiToken && (
                  <JitsiFrame
                    roomId={id}
                    token={jitsiData.generateJitsiToken.token}
                    displayName={jitsiData.generateJitsiToken.displayName}
                  />
                )}
              </div>
            </ShadowBoxCard>
          </Grid>
        )}

        <Grid item xs={useJitsi ? 3 : 6} className="firstRowItem">
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
              launchedEvents={data.session.launchedEvents}
            />
          )}
        </Grid>
      </Grid>
      <SessionMenu sessionId={id} presenter />
    </div>
  );
}
