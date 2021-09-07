import "./SessionResultEvents.scss";

import { CircularProgress, List } from "@material-ui/core";
import { useHistory, useRouteMatch } from "react-router";

import ErrorAlert from "../../utils/Alerts/ErrorAlert";
import EventCard from "./EventCard/EventCard";
import { ReactElement } from "react";
import { useSessionSummaryQuery } from "../../../graphql";

interface SessionResultEventsProps {
  sessionId: string;
}

export default function SessionResultEvents({
  sessionId,
}: SessionResultEventsProps): ReactElement {
  const { data, loading } = useSessionSummaryQuery({
    variables: { id: sessionId },
  });
  const history = useHistory();
  const { url } = useRouteMatch();

  const onCardClick = (launchedEventId: string) => {
    history.push(url + `/${launchedEventId}`);
  };

  if (loading) {
    return (
      <div className="SessionResultEvents">
        <CircularProgress />
      </div>
    );
  }

  if (data?.sessionSummary) {
    return (
      <>
        <div className="SessionResultEvents">
          <List>
            {data.sessionSummary.eventParticipations.map((element) => (
              <EventCard
                key={element.eventId}
                event={element}
                onClick={() => onCardClick(element.launchedEventId)}
              />
            ))}
          </List>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="SessionResultEvents">
        <ErrorAlert />
      </div>
    </>
  );
}
