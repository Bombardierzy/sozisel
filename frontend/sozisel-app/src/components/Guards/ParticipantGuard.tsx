import React, { ReactElement, useEffect } from "react";

import AuthGuard from "./AuthGuard";
import { PARTICIPANT_TOKEN } from "../../common/consts";
import ParticipantActiveSession from "../ParticipantActiveSession/ParticipantActiveSession";
import PresenterSession from "../PresenterSession/PresenterSession";
import { useHistory } from "react-router";
import { useMyParticipationQuery } from "../../graphql";
import { useParams } from "react-router-dom";
import useSessionParticipantType from "../../hooks/useSessionParticipantType";

export default function ParticipantGuard(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { token, type } = useSessionParticipantType();
  const history = useHistory();
  const { data, error } = useMyParticipationQuery({
    variables: { token: token ?? "" },
  });

  useEffect(() => {
    if (type === "participant") {
      if (
        error ||
        (data?.myParticipation && data.myParticipation.sessionId !== id)
      ) {
        console.error(error);
        history.push("/");
        localStorage.removeItem(PARTICIPANT_TOKEN);
      }
    }
  }, [error, history, data, id, type]);

  if (type === "presenter") {
    return <AuthGuard component={PresenterSession} />;
  }

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
