import {
  EventResultSubmittedSubscription,
  useWhiteboardSummaryQuery,
} from "../../graphql";
import { useEffect, useState } from "react";

interface FetchWhiteboardLiveResult {
  eventResult?: EventResultSubmittedSubscription;
  skip: boolean;
  eventId: string;
}

export type WhiteboardResult = {
  finishedTrials: number;
};

const useFetchWhiteboardLiveResult = ({
  eventResult,
  eventId,
  skip,
}: FetchWhiteboardLiveResult): WhiteboardResult => {
  const [finishedTrials, setFinishedTrials] = useState<number>(0);

  const { data } = useWhiteboardSummaryQuery({
    variables: {
      id: eventId,
    },
    skip,
  });

  useEffect(() => {
    if (eventResult) {
      setFinishedTrials((finishedTrials) => finishedTrials + 1);
    }
  }, [eventResult]);

  useEffect(() => {
    if (data) {
      setFinishedTrials(
        data.whiteboardSummary?.participantsWhiteboardTasks?.length || 0
      );
    }
  }, [data]);

  return { finishedTrials };
};

export default useFetchWhiteboardLiveResult;
