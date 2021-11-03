import "./ParticipantsList.scss";

import { Alert, Skeleton } from "@material-ui/lab";
import React, { ReactElement, useMemo } from "react";

import GroupIcon from "@material-ui/icons/Group";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Participant } from "../../../hooks/useLiveSessionParticipation";
import PersonIcon from "@material-ui/icons/Person";
import ShadowBoxCard from "../../utils/Card/ShadowBoxCard";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface ParticipantsListProps {
  error: string | undefined;
  loading: boolean;
  participants: Participant[];
}

export default function ParticipantsList({
  error,
  loading,
  participants,
}: ParticipantsListProps): ReactElement {
  const { t } = useTranslation("common");

  const sortedParticipants = useMemo(() => {
    return participants.sort((a, b) => {
      if (a.type == b.type) return 0;
      if (a.type === "presenter") return -1;
      return 1;
    });
  }, [participants]);

  return (
    <div className="ParticipantsList">
      <ShadowBoxCard>
        <div className="content">
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
          {sortedParticipants.length > 0 &&
            sortedParticipants.map(({ id, displayName, type }) => (
              <div key={id} className="participant">
                {type == "presenter" ? (
                  <>
                    <Typography className="presenter">{displayName}</Typography>
                    <PersonIcon className="presenter" />
                  </>
                ) : (
                  <>
                    <Typography>{displayName}</Typography>
                    <MoreVertIcon className="moreIcon" />
                  </>
                )}
              </div>
            ))}
        </div>
      </ShadowBoxCard>
    </div>
  );
}
