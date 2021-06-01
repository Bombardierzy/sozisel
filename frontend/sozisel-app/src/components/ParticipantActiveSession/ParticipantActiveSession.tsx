import "./ParticipantActiveSession.scss";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import Fab from "@material-ui/core/Fab";
import JitsiFrame from "../Jitsi/JitsiFrame";
import ParticipantQuizEvent from "./Modules/QuizEvent/ParticipantQuizEvent";
import { ReactElement } from "react";
import { useGenerateJitsiTokenQuery } from "../../graphql/index";

export default function ParticipantActiveSession(): ReactElement {
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: "Użytkownik",
      email: "user@gmail.com",
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
