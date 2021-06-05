import "./ParticipantActiveSession.scss";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import Fab from "@material-ui/core/Fab";
import JitsiFrame from "../Jitsi/JitsiFrame";
import { ParticipantQuizContextProvider } from "../../contexts/ParticipantQuiz/ParticipantQuizContext";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import { ReactElement } from "react";
import { useGenerateJitsiTokenQuery } from "../../graphql/index";
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
  const { sessionId } = useParams<{ sessionId: string }>();
  const { t } = useTranslation("common");
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: fullName,
      email: email,
      roomId: sessionId,
    },
  });

  return (
    <>
      <BasicNavbar />
      <div className="ParticipantActiveSession">
        <div className="jitsi">
          {!loading && data?.generateJitsiToken.token && (
            <JitsiFrame
              roomId="room"
              token={data.generateJitsiToken.token}
              displayName={data.generateJitsiToken.displayName}
            />
          )}
        </div>
        <div className="moduleComponent">
          {/* TODO change mock data, after adding subscription for events */}
          <ParticipantQuizContextProvider>
            <ParticipantQuizEvent
              token={token}
              event={{
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
              }}
            />
          </ParticipantQuizContextProvider>
        </div>
      </div>
      <Fab
        variant="extended"
        className="ParticipantSessionFab"
        color="primary"
        style={{ position: "fixed" }}
      >
        {t("components.JoinSession.email") ?? ""}
      </Fab>
    </>
  );
}
