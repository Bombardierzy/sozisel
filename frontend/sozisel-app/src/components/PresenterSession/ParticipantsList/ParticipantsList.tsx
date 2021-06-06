import "./ParticipantsList.scss";

import { Alert, Skeleton } from "@material-ui/lab";
import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import GroupIcon from "@material-ui/icons/Group";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useLiveSessionParticipation } from "../../../hooks/useLiveSessionParticipation";
import { useMeQuery } from "../../../graphql";
import { useTranslation } from "react-i18next";

interface ParticipantsListProps {
  sessionId: string;
}

const Participants = [
  { key: "essa", displayName: "Sebastian Kuśnierz" },
  { key: "essa1", displayName: "Władek Bombowiec" },
  { key: "essa2", displayName: "Marcin Essasito" },
];

export default function ParticipantsList({
  sessionId,
}: ParticipantsListProps): ReactElement {
  const { data } = useMeQuery();
  const { t } = useTranslation("common");
  const { participants, error, loading } = useLiveSessionParticipation({
    displayName: `${data?.me.firstName} ${data?.me.lastName}`,
    sessionId,
  });

  console.log(participants)

  if (error) {
    return (
      <Paper elevation={2} className="ParticipantsList">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.PresenterSession.ParticipantsList.fetchingError")}
        </Alert>
      </Paper>
    );
  }

  if (loading) {
  return (
    <Paper elevation={2} className="ParticipantsList">
      <Typography className="header">
        <GroupIcon className="icon" />
        {t("components.PresenterSession.ParticipantsList.header")}
      </Typography>
      <Skeleton height={30} />
      <Skeleton height={30} />
      <Skeleton height={30} />
    </Paper>
  );
  }

  return (
    <Paper elevation={2} className="ParticipantsList">
      <Typography className="header">
        <GroupIcon className="icon" />
        {t("components.PresenterSession.ParticipantsList.header")}
      </Typography>
      {Participants.map((participant, idx) => (
        <div key={participant.key} className="participant">
          {idx == 0 ? (
            <Typography className="me">{participant.displayName}</Typography>
          ) : (
            <>
              <Typography>{participant.displayName}</Typography>
              <MoreVertIcon className="moreIcon"/>
            </>
          )}
        </div>
      ))}
    </Paper>
  );
}
