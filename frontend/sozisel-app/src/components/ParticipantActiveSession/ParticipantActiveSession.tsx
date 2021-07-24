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

import ActiveSessionAgenda from "../PresenterSession/ActiveSessionAgenda/ActiveSessionAgenda";
import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import ErrorAlert from "../utils/Alerts/ErrorAlert";
import JitsiFrame from "../Jitsi/JitsiFrame";
import { ParticipantQuizContextProvider } from "../../contexts/ParticipantQuiz/ParticipantQuizContext";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import ParticipantsList from "../PresenterSession/ParticipantsList/ParticipantsList";
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
          history.push(`/`);
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
        <div className="ParticipantActiveSession">
          {!activeEvent && (
            <div className="agendaComponent">
              <ActiveSessionAgenda
                agendaEntries={session.sessionThumbnail.agendaEntries}
                estimatedTimeInSeconds={session.sessionThumbnail.estimatedTime}
                sessionStartDate={new Date(session.sessionThumbnail.startTime)}
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
          {activeEvent &&
            activeEvent.eventData.__typename === "ParticipantQuiz" && (
              <div className="moduleComponent">
                <ParticipantQuizContextProvider>
                  <ParticipantQuizEvent
                    onQuizFinished={() => setActiveEvent(null)}
                    token={token}
                    event={activeEvent}
                  />
                </ParticipantQuizContextProvider>
              </div>
            )}
        </div>
        <Fab
          variant="extended"
          className="ParticipantSessionFab"
          color="primary"
          style={{ position: "fixed" }}
          onClick={() => {
            history.push(`/`);
          }}
        >
          {t("components.ParticipantActiveSession.exitSession") ?? ""}
        </Fab>
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
