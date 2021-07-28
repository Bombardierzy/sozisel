import "./SessionResultEvents.scss";

import { CircularProgress, List } from "@material-ui/core";

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

  if (loading) {
    return (
      <>
        <div className="SessionResultEvents">
          <CircularProgress></CircularProgress>
        </div>
      </>
    );
  }

  if (data?.sessionSummary) {
    console.log(data.sessionSummary);

    return (
      <>
        <div className="SessionResultEvents">
          <List>
            {data.sessionSummary.eventParticipations.map((element, _) => (
              <EventCard key={element.eventId} event={element} />
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
