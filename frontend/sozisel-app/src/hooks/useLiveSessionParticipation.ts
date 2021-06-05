import {
  ensureConnected,
  usePhoenixSocket,
} from "../contexts/PhoenixSocketContext";
import { useEffect, useState } from "react";

type ParticipantType = "participant" | "presenter";

interface Config {
  sessionId: string;
  token: string;
  type: ParticipantType;
}

interface Participant {
  id: string;
  displayName: string;
  type: ParticipantType;
}

interface Participation {
  participants: Participant[];
  loading: boolean;
  error?: string;
}

interface PresenceEntry {
  metas: { id: string; display_name: string; type: string; phx_ref: string }[];
}

export function useLiveSessionParticipation({
  sessionId,
  token,
  type,
}: Config): Participation {
  const socket = usePhoenixSocket();

  const [participation, setParticipation] = useState<Participation>({
    participants: [],
    loading: true,
    error: undefined,
  });

  useEffect(() => {
    ensureConnected(socket);

    const tokenType =
      type === "participant" ? "participantToken" : "presenterToken";

    const channel = socket.channel(`session:participation:${sessionId}`, {
      [tokenType]: token,
      type,
    });

    channel
      .join()
      .receive("ok", () => setParticipation((p) => ({ ...p, loading: false })))
      .receive("error", (error) =>
        setParticipation((p) => ({ ...p, loading: false, error }))
      );

    channel.on("presence_state", (state) => {
      const participants = Object.entries(state).map(parsePresenceEntry);

      setParticipation((p) => ({ ...p, participants: participants }));
    });

    channel.on("presence_diff", ({ joins, leaves }) => {
      const joiningParticipants = Object.entries(joins).map(parsePresenceEntry);
      const leavingParticipantIds = Object.entries(leaves)
        .map(parsePresenceEntry)
        .map(({ id }) => id);

      setParticipation((p) => {
        const currentParticipantKeys = p.participants.map(({ id }) => id);
        const newParticipants = joiningParticipants.filter(
          ({ id }) => !currentParticipantKeys.includes(id)
        );

        return {
          ...p,
          participants: [
            ...p.participants.filter(
              ({ id }) => !leavingParticipantIds.includes(id)
            ),
            ...newParticipants,
          ],
        };
      });
    });

    return () => {
      channel.leave();
    };
  }, [socket, setParticipation, token, type, sessionId]);

  return participation;
}

function parsePresenceEntry([key, entry]: [string, unknown]): Participant {
  const {
    metas: [meta],
  } = entry as PresenceEntry;
  return {
    displayName: meta.display_name,
    type: meta.type as ParticipantType,
    id: meta.id,
  };
}
