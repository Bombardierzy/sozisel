import { PARTICIPANT_TOKEN, USER_TOKEN } from "../common/consts";

import { useMemo } from "react";

interface ParticipantInfo {
  token: string;
  type: "participant" | "presenter";
}

export default function useSessionParticipantType(): ParticipantInfo {
  const participant = useMemo<ParticipantInfo>(() => {
    let token = localStorage.getItem(USER_TOKEN);
    if (token !== null) {
      return { token, type: "presenter" };
    }

    token = localStorage.getItem(PARTICIPANT_TOKEN);
    if (token !== null) {
      return { token, type: "participant" };
    }

    console.warn(
      "Neither participant token nor user token has been found, useSessionParticipantType will return default values"
    );
    return { token: "", type: "participant" };
  }, []);

  return participant;
}
