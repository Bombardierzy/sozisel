import "./LiveSession.scss";

import { ReactElement } from "react";
import { useLiveSessionParticipation } from "../../hooks/useLiveSessionParticipation";
import { useParams } from "react-router-dom";
import useSessionParticipantType from "../../hooks/useSessionParticipantType";
import { useTranslation } from "react-i18next";

export function LiveSession(): ReactElement {
  const { session_id } = useParams<{ session_id: string }>();
  const { t } = useTranslation("common");
  const { token, type } = useSessionParticipantType();

  const { participants, error, loading } = useLiveSessionParticipation({
    sessionId: session_id,
    type,
    token,
  });

  return (
    <div className="LiveSession">
      <h2>{t("components.LiveSession.placeholder")}</h2>
      {participants.length > 0 && (
        <div className="participantsList">
          {participants.map(({ displayName, id }) => (
            <div key={id}>{displayName}</div>
          ))}
        </div>
      )}
      {loading && "Still loading"}
      {error && error}
    </div>
  );
}
