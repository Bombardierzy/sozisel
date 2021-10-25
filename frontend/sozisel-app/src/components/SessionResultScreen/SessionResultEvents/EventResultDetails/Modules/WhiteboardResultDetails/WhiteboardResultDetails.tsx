import "./WhiteboardResultDetails.scss";
import React, { ReactElement } from "react";
import { CircularProgress } from "@material-ui/core";
import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventDescription from "./EventDescription/EventDescription";
import MainContent from "./MainContent/MainContent";
import { useWhiteboardSummaryQuery } from "../../../../../../graphql";

interface WhiteboardResultDetailsProps {
  id: string;
  eventName: string;
}

const WhiteboardResultDetails = ({
  id,
  eventName,
}: WhiteboardResultDetailsProps): ReactElement => {
  const { data, error, loading } = useWhiteboardSummaryQuery({
    variables: {
      id,
    },
  });

  if (loading || !data?.whiteboardSummary) {
    return (
      <div className="WhiteboardResultDetials">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="WhiteboardResultDetials">
        <ErrorAlert />
      </div>
    );
  }

  const { participantsWhiteboardTasks, averageUsedTime, task } =
    data.whiteboardSummary;

  return (
    <div className="WhiteboardResultDetials">
      <EventDescription
        eventName={eventName}
        participantsNumber={participantsWhiteboardTasks.length}
        task={task}
        averageUsedTime={averageUsedTime}
      />
      <MainContent />
    </div>
  );
};

export default WhiteboardResultDetails;
