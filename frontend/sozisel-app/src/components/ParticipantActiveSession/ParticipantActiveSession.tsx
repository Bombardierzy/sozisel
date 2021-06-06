import "./ParticipantActiveSession.scss";

import {
  ParticipantEvent,
  useGenerateJitsiTokenQuery,
} from "../../graphql/index";
import { ReactElement, useState } from "react";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import Fab from "@material-ui/core/Fab";
import JitsiFrame from "../Jitsi/JitsiFrame";
import { ParticipantQuizContextProvider } from "../../contexts/ParticipantQuiz/ParticipantQuizContext";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
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

  return (
    <>
      <BasicNavbar />
      <div className="ParticipantActiveSession">
        <div className="jitsi">
          {!loading && data?.generateJitsiToken.token && (
            <JitsiFrame
              roomId={id}
              token={data.generateJitsiToken.token}
              displayName={data.generateJitsiToken.displayName}
            />
          )}
        </div>
        <div className="moduleComponent">
          {activeEvent && (
            <ParticipantQuizContextProvider>
              <ParticipantQuizEvent
                onQuizFinished={() => setActiveEvent(null)}
                token={token}
                event={activeEvent}
              />
            </ParticipantQuizContextProvider>
          )}
        </div>
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
