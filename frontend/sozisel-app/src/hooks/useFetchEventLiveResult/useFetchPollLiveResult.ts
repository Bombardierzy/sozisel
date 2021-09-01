import { useEffect, useState } from "react";
import { useLivePollSummarySubscription } from "../../graphql";
import useSessionParticipantType from "../useSessionParticipantType";

export type PollResult = {
  mostCommonAnswer: string;
  completedTrialsNumber: number;
};

const useFetchPollLiveResult = (skip: boolean, eventId: string): PollResult => {
  const [pollResults, setPollResults] = useState<PollResult>({
    mostCommonAnswer: "",
    completedTrialsNumber: 0,
  });
  const { token, type } = useSessionParticipantType();

  console.log(`presenter ${eventId}`);
  const { data, loading } = useLivePollSummarySubscription({
    skip,
    variables: {
      eventId,
      token,
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data, loading]);

  return pollResults;
};

export default useFetchPollLiveResult;
