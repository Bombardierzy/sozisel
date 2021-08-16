import "./EventResultDetails.scss";

import { Button, CircularProgress, IconButton } from "@material-ui/core";
import React, { ReactElement } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ErrorAlert from "../../../utils/Alerts/ErrorAlert";
import { useSessionSummaryQuery } from "../../../../graphql";
import { useTranslation } from "react-i18next";

export interface EventResultDetailsProps {
  sessionId: string;
}

export default function EventResultDetails({
  sessionId,
}: EventResultDetailsProps): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useSessionSummaryQuery({
    variables: { id: sessionId },
  });
  const history = useHistory();
  const { t } = useTranslation("common");
  const url = useRouteMatch().url.replace(`/${id}`, "");

  const onButtonPressed = (id?: string) => {
    history.push(url + `${id ? `/${id}` : ""}`);
  };

  if (loading) {
    return (
      <div className="EventResultDetails">
        <CircularProgress />
      </div>
    );
  }

  if (data?.sessionSummary) {
    const eventsListLength = data.sessionSummary.eventParticipations.length;
    const currentEventIndex = data.sessionSummary.eventParticipations.findIndex(
      (element) => element.eventId === id
    );
    const previousId =
      data.sessionSummary.eventParticipations[
        currentEventIndex === 0 ? eventsListLength - 1 : currentEventIndex - 1
      ].eventId;
    const nextId =
      data.sessionSummary.eventParticipations[
        (currentEventIndex + 1) % eventsListLength
      ].eventId;
    return (
      <div className="EventResultDetails">
        <div className="eventBanner">
          <div className="eventBannerContent">
            <IconButton
              className="eventBannerItem"
              onClick={() => onButtonPressed()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Button
              className="eventBannerItem"
              onClick={() => onButtonPressed(previousId)}
            >
              {t("components.SessionEventResults.Banner.previous")}
            </Button>
            <Button
              className="eventBannerItem"
              onClick={() => onButtonPressed(nextId)}
            >
              {t("components.SessionEventResults.Banner.next")}
            </Button>
          </div>
        </div>
        {id}
      </div>
    );
  }

  return (
    <>
      <div className="EventResultDetails">
        <ErrorAlert />
      </div>
    </>
  );
}
