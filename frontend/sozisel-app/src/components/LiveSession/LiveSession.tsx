import "./LiveSession.scss";

import { ReactElement } from "react";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LiveSessionParams {
  sessionId: string;
}

export function LiveSession(): ReactElement {
  const { sessionId } = useParams<LiveSessionParams>();
  const { t } = useTranslation("common");

  const { participants, error, loading } = useLiveSessionParticipation({
    displayName: "User",
    sessionId,
  });

  return (
    <div className="LiveSession">
      <h2>{t("components.LiveSession.placeholder")}</h2>
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
