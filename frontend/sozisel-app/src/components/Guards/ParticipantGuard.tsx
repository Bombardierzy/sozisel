import React, { ReactElement, useEffect } from "react";

import ParticipantActiveSession from "../ParticipantActiveSession/ParticipantActiveSession";
import { useHistory } from "react-router";
import { useMyParticipationQuery } from "../../graphql";

export default function ParticipantGuard(): ReactElement {
  const token = localStorage.getItem("participantToken");
  const { data, error } = useMyParticipationQuery({
    variables: { token: token ?? "" },
  });
  const history = useHistory();

  useEffect(() => {
    if (error) {
      console.error(error);
      history.push("/");
      localStorage.removeItem("participantToken");
    }
  }, [error, history]);

  if (data?.myParticipation) {
    return (
      <ParticipantActiveSession
        token={token ?? ""}
        email={data.myParticipation.email}
        fullName={data.myParticipation.fullName}
      />
    );
  }

  return <></>;
}
