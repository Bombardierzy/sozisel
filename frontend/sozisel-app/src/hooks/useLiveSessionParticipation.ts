import {
  ensureConnected,
  usePhoenixSocket,
} from "../contexts/PhoenixSocketContext";
import { useEffect, useState } from "react";

interface Config {
  sessionId: string;
  displayName: string;
}

interface Participant {
  key: string;
  displayName: string;
}

interface Participation {
  participants: Participant[];
  loading: boolean;
  error?: string;
}

interface PresenceEntry {
  metas: { display_name: string; phx_ref: string }[];
}

export function useLiveSessionParticipation({
  displayName,
  sessionId,
}: Config): Participation {
  const socket = usePhoenixSocket();

  const [participation, setParticipation] = useState<Participation>({
    participants: [],
    loading: true,
    error: undefined,
  });

  useEffect(() => {
    ensureConnected(socket);

    const channel = socket.channel(`session:participation:${sessionId}`, {
      displayName,
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
      const leavingParticipantKeys = Object.entries(leaves)
        .map(parsePresenceEntry)
        .map(({ key }) => key);

      setParticipation((p) => {
        const currentParticipantKeys = p.participants.map(({ key }) => key);
        const newParticipants = joiningParticipants.filter(
          ({ key }) => !currentParticipantKeys.includes(key)
        );

        return {
          ...p,
          participants: [
            ...p.participants.filter(
              ({ key }) => !leavingParticipantKeys.includes(key)
            ),
            ...newParticipants,
          ],
        };
      });
    });

    return () => {
      channel.leave();
    };
  }, [socket, setParticipation, displayName, sessionId]);

  return participation;
}

function parsePresenceEntry([key, entry]: [string, unknown]): Participant {
  const {
    metas: [meta],
  } = entry as PresenceEntry;
  return { displayName: meta.display_name, key };
}
