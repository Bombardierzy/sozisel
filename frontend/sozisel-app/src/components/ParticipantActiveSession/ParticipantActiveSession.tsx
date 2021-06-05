import "./ParticipantActiveSession.scss";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import Fab from "@material-ui/core/Fab";
import JitsiFrame from "../Jitsi/JitsiFrame";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import { ReactElement } from "react";
import { useGenerateJitsiTokenQuery } from "../../graphql/index";
import { useParams } from "react-router-dom";

export interface ParticipantActiveSessionProps {
  token: string;
  fullName: string;
  email: string;
  id: string;
}
export default function ParticipantActiveSession({
  token,
  fullName,
  email,
  id,
}: ParticipantActiveSessionProps): ReactElement {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: fullName,
      email: email,
      roomId: "room",
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
          <ParticipantQuizEvent />
        </div>
      </div>
      <Fab
        variant="extended"
        className="ParticipantSessionFab"
        color="primary"
        style={{ position: "fixed" }}
      >
        Wyjdź
      </Fab>
    </>
  );
}
