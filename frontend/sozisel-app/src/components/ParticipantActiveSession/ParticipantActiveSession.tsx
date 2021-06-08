import "./ParticipantActiveSession.scss";

import { CircularProgress, Fab } from "@material-ui/core";
import {
  ParticipantEvent,
  useActiveSessionThumbnailQuery,
  useGenerateJitsiTokenQuery,
} from "../../graphql/index";
import { ReactElement, useState } from "react";

import ActiveSessionAgenda from "../PresenterSession/ActiveSessionAgenda/ActiveSessionAgenda";
import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import ErrorAlert from "../utils/Alerts/ErrorAlert";
import JitsiFrame from "../Jitsi/JitsiFrame";
import { ParticipantQuizContextProvider } from "../../contexts/ParticipantQuiz/ParticipantQuizContext";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import ParticipantsList from "../PresenterSession/ParticipantsList/ParticipantsList";
import { useParams } from "react-router-dom";
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
  const {
    data: session,
    loading: sessionLoading,
  } = useActiveSessionThumbnailQuery({ variables: { id } });
  const { t } = useTranslation("common");
  // TODO change mock data, after adding subscription for events
  const [activeEvent, setActiveEvent] = useState<ParticipantEvent | null>({
    name: "Quiz na rozgrzewkę",
    id: "id",
    eventData: {
      durationTimeSec: 100,
      trackingMode: true,
      quizQuestions: [
        {
          id: "q1",
          question: "Kto był królem Polski",
          answers: [
            {
              id: "a11",
              text: "Mieszko 1",
            },
            {
              id: "a12",
              text: "Andrzej Duda",
            },
            {
              id: "a13",
              text: "Zbigniew Stonoga",
            },
          ],
        },
        {
          id: "q2",
          question: "Kto był prezydentem Polski",
          answers: [
            {
              id: "a21",
              text: "Lech Wałęsa",
            },
            {
              id: "a22",
              text: "Andrzej Duda",
            },
            {
              id: "a23",
              text: "Zbigniew Stonoga",
            },
          ],
        },
      ],
    },
  });
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: fullName,
      email: email,
      roomId: id,
    },
  });

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
              <ParticipantsList sessionId={id} />
            </div>
          )}
          {activeEvent && (
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
