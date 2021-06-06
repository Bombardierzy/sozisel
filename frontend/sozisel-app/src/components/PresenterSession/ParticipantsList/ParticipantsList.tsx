import "./ParticipantsList.scss";

import { Alert, Skeleton } from "@material-ui/lab";
import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import GroupIcon from "@material-ui/icons/Group";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useLiveSessionParticipation } from "../../../hooks/useLiveSessionParticipation";
import useSessionParticipantType from "../../../hooks/useSessionParticipantType";
import { useTranslation } from "react-i18next";

interface ParticipantsListProps {
  sessionId: string;
}

export default function ParticipantsList({
  sessionId,
}: ParticipantsListProps): ReactElement {
  const { token, type } = useSessionParticipantType();
  const { t } = useTranslation("common");
  const { participants, error, loading } = useLiveSessionParticipation({
    sessionId,
    type,
    token,
  });

  return (
    <Paper elevation={2} className="ParticipantsList">
      <Typography className="header">
        <GroupIcon className="icon" />
        {t("components.PresenterSession.ParticipantsList.header")}
      </Typography>
      {error && (
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.PresenterSession.ParticipantsList.fetchingError")}
        </Alert>
      )}
      {loading && (
        <>
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
        </>
      )}
      {participants.length > 0 &&
        participants.map(({ id, displayName, type }) => (
          <div key={id} className="participant">
            {type == "presenter" ? (
              <Typography className="presenter">{displayName}</Typography>
            ) : (
              <>
                <Typography>{displayName}</Typography>
                <MoreVertIcon className="moreIcon" />
              </>
            )}
          </div>
        ))}
    </Paper>
  );
}
