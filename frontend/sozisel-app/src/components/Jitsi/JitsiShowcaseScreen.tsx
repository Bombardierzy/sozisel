import "./JitsiShowcaseScreen.scss";

import JitsiFrame from "./JitsiFrame";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import { ReactElement } from "react";
import { useGenerateJitsiTokenQuery } from "../../graphql/index";

export default function JitsiShowcaseScreen(): ReactElement {
  const { data, loading } = useGenerateJitsiTokenQuery({
    variables: {
      displayName: "Użytkownik",
      email: "user@gmail.com",
      roomId: "room",
    },
  });

  return (
    <>
      <MainNavbar />
      <div className="Jitsi">
        {!loading && data?.generateJitsiToken.token && (
          <JitsiFrame
            roomId="room"
            token={data.generateJitsiToken.token}
            displayName={data.generateJitsiToken.displayName}
          />
        )}
      </div>
    </>
  );
}
