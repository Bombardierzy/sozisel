import {
  EventResultSubmittedSubscription,
  PollOptionSummary,
  usePollSummaryQuery,
} from "../../graphql";
import { useEffect, useState } from "react";
import { Event } from "../../model/Template";

type PollOption = Pick<PollOptionSummary, "id" | "text" | "votes">;

export interface PollSummary {
  optionsSummary: PollOption[];
  totalVoters: number;
  mostAnsweredOption: string;
}

interface UseFetchPollLiveResultProps {
  eventResult?: EventResultSubmittedSubscription;
  skip: boolean;
  event: Event;
  eventId: string;
}

//sorting options in descending order
const sortOptions = (options: PollOption[]): PollOption[] =>
  options.slice().sort((a, b) => b.votes - a.votes);

//if there are more than one option with the same number of votes concant options text of these options e.g. Nie, Tak
const getMostAnsweredOptionsText = (sortedOptions: PollOption[]): string =>
  sortedOptions
    ?.filter((option) => option.votes === sortedOptions[0].votes)
    .map((option) => option.text)
    .join(", ") || "";

const useFetchPollLiveResult = ({
  eventResult,
  skip,
  eventId,
  event,
}: UseFetchPollLiveResultProps): PollSummary => {
  const [pollSummary, setPollSummary] = useState<PollSummary>({
    optionsSummary:
      event.eventData.__typename === "Poll"
        ? event.eventData.options.map((option) => ({
            id: option.id,
            text: option.text,
            votes: 0,
          }))
        : [],
    totalVoters: 0,
    mostAnsweredOption: "",
  });

  const { data: pollSummaryData, loading } = usePollSummaryQuery({
    skip,
    variables: {
      id: eventId,
    },
  });

  useEffect(() => {
    const livePollSummary = pollSummaryData?.pollSummary;
    if (livePollSummary) {
      const sortedOptions = sortOptions(livePollSummary?.optionSummaries);
      setPollSummary({
        optionsSummary: livePollSummary?.optionSummaries || [],
        totalVoters: livePollSummary?.totalVoters || 0,
        mostAnsweredOption: getMostAnsweredOptionsText(sortedOptions),
      });
    }
  }, [pollSummaryData, loading]);

  useEffect(() => {
    if (
      eventResult?.eventResultSubmitted?.resultData.__typename === "PollResult"
    ) {
      const { optionIds } = eventResult.eventResultSubmitted.resultData;
      setPollSummary((pollSummary) => {
        //caluclate distribution of votes
        const newOptionsSummary = pollSummary.optionsSummary.map((option) =>
          optionIds.includes(option.id)
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        const sortedOptions = sortOptions(newOptionsSummary);
        return {
          optionsSummary: newOptionsSummary,
          totalVoters: pollSummary.totalVoters + 1,
          mostAnsweredOption: getMostAnsweredOptionsText(sortedOptions),
        };
      });
    }
  }, [eventResult]);

  return pollSummary;
};

export default useFetchPollLiveResult;
