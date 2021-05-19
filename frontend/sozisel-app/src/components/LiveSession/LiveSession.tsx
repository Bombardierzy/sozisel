import "./LiveSession.scss";

import { ReactElement } from "react";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useParams } from "react-router-dom";

interface LiveSessionParams {
  sessionId: string;
}

export function LiveSession(): ReactElement {
  const { sessionId } = useParams<LiveSessionParams>();

  const { participants, error, loading } = useLiveSessionParticipation({
    displayName: "User",
    sessionId,
  });

  return (
    <div className="LiveSession">
      <h2>You are inside live session!</h2>
      {participants.length > 0 && (
        <div className="participantsList">
          {participants.map(({ displayName, key }) => (
            <div key={key}>{displayName}</div>
          ))}
        </div>
      )}
      {loading && "Still loading"}
      {error && error}
    </div>
  );
}
