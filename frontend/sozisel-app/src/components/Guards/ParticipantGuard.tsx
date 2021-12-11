import React, { ReactElement, useEffect } from "react";
import {
  useMyParticipationQuery,
  useSessionThumbnailQuery,
} from "../../graphql";

import AuthGuard from "./AuthGuard";
import { PARTICIPANT_TOKEN } from "../../common/consts";
import ParticipantActiveSession from "../ParticipantActiveSession/ParticipantActiveSession";
import PresenterSession from "../PresenterSession/PresenterSession";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import useSessionParticipantType from "../../hooks/useSessionParticipantType";

export default function ParticipantGuard(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { token, type } = useSessionParticipantType();
  const history = useHistory();
  const { data, error } = useMyParticipationQuery({
    variables: { token: token ?? "" },
  });
  const { data: session } = useSessionThumbnailQuery({
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (type === "participant") {
      if (
        error ||
        (data?.myParticipation && data.myParticipation.sessionId !== id) ||
        session?.sessionThumbnail?.sessionEnded
      ) {
        console.error(error);
        history.push("/");
        localStorage.removeItem(PARTICIPANT_TOKEN);
      }
    }
  }, [error, history, data, id, type, session]);

  if (type === "presenter") {
    return <AuthGuard component={PresenterSession} />;
  }

  if (data?.myParticipation && session?.sessionThumbnail) {
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
