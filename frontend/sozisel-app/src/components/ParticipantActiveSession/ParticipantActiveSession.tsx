import "./ParticipantActiveSession.scss";

import { CircularProgress, Fab } from "@material-ui/core";
import {
  ParticipantEvent,
  SessionInfo,
  useActiveSessionThumbnailQuery,
  useEventLaunchedSubscription,
  useGenerateJitsiTokenQuery,
  useSessionNotificationsSubscription,
} from "../../graphql/index";
import { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import ActiveEvent from "./ActiveEvent";
import ActiveSessionAgenda from "../PresenterSession/ActiveSessionAgenda/ActiveSessionAgenda";
import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import ErrorAlert from "../utils/Alerts/ErrorAlert";
import JitsiFrame from "../Jitsi/JitsiFrame";
import { PARTICIPANT_TOKEN } from "../../common/consts";
import ParticipantWhiteboardContext from "../../contexts/ParticipantWhiteboard/ParticipantWhiteboardContext";
import ParticipantsList from "../PresenterSession/ParticipantsList/ParticipantsList";
import { SessionMenu } from "../SessionMenu/SessionMenu";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useTranslation } from "react-i18next";

export interface ParticipantActiveSessionProps {
  token: string;
  fullName: string;
  email: string;
}
export default function ParticipantActiveSession({
  token,
  fullName,
  email,
}: ParticipantActiveSessionProps): ReactElement {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { data: session, loading: sessionLoading } =
    useActiveSessionThumbnailQuery({ variables: { id } });

  const {
    participants,
    error: getParticipantsError,
    loading: getParticipantsLoading,
  } = useLiveSessionParticipation({
    sessionId: id,
    type: "participant",
    token,
  });

  const { data: eventData } = useEventLaunchedSubscription({
    variables: { token },
  });
  const { data: sessionNotifications } = useSessionNotificationsSubscription({
    variables: { token },
  });
  const { t } = useTranslation("common");
  const [activeEvent, setActiveEvent] = useState<ParticipantEvent | null>(null);
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: fullName,
      email: email,
      roomId: id,
    },
  });

  useEffect(() => {
    if (eventData?.eventLaunched) {
      setActiveEvent(eventData.eventLaunched);
    }
  }, [eventData]);

  useEffect(() => {
    if (sessionNotifications?.sessionNotifications) {
      switch (sessionNotifications.sessionNotifications.info) {
        case SessionInfo.SessionEnd:
          localStorage.removeItem(PARTICIPANT_TOKEN);
          history.push(`/goodbye`);
          break;
        default:
          break;
      }
    }
  }, [sessionNotifications, history]);

  if (sessionLoading) {
    return (
      <>
        <BasicNavbar />
        <div className="ParticipantActiveSession">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (session?.sessionThumbnail) {
    return (
      <>
        <BasicNavbar />
        <ParticipantWhiteboardContext>
          <div className="ParticipantActiveSession">
            {!activeEvent && (
              <div className="agendaComponent">
                <ActiveSessionAgenda
                  agendaEntries={session.sessionThumbnail.agendaEntries}
                  estimatedTimeInSeconds={
                    session.sessionThumbnail.estimatedTime
                  }
                  sessionStartDate={
                    new Date(session.sessionThumbnail.startTime)
                  }
                />
              </div>
            )}
            {session.sessionThumbnail.useJitsi && (
              <div className="jitsi">
                {!loading && data?.generateJitsiToken.token && (
                  <JitsiFrame
                    roomId={id}
                    token={data.generateJitsiToken.token}
                    displayName={data.generateJitsiToken.displayName}
                  />
                )}
              </div>
            )}
            {!activeEvent && (
              <div className="moduleComponent">
                <ParticipantsList
                  participants={participants}
                  loading={getParticipantsLoading}
                  error={getParticipantsError}
                />
              </div>
            )}
            {activeEvent && (
              <div className="moduleComponent">
                <ActiveEvent
                  onEventFinished={() => setActiveEvent(null)}
                  token={token}
                  activeEvent={activeEvent}
                  withJitsi={session.sessionThumbnail.useJitsi}
                />
              </div>
            )}
          </div>
        </ParticipantWhiteboardContext>
        <Fab
          variant="extended"
          className="ParticipantSessionFab"
          classes={{ primary: "ParticipantSessionFab" }}
          color="primary"
          style={{ position: "fixed" }}
          onClick={() => {
            localStorage.removeItem(PARTICIPANT_TOKEN);
            history.push(`/`);
          }}
        >
          {t("components.ParticipantActiveSession.exitSession") ?? ""}
        </Fab>
        <SessionMenu sessionId={id} />
      </>
    );
  }

  return (
    <>
      <BasicNavbar />
      <div className="CreateSession">
        <ErrorAlert />
      </div>
    </>
  );
}
