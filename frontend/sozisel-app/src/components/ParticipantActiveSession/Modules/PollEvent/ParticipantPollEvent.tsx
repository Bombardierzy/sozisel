import "./ParticipantPollEvent.scss";
import { Button, List, Paper, Typography } from "@material-ui/core";
import {
  ParticipantEvent,
  Poll,
  PollOption,
  useSubmitPollResultsMutation,
} from "../../../../graphql";
import { ReactElement, useState } from "react";
import PollEventOption from "./PollEventOption/PollEventOption";
import PollIcon from "@material-ui/icons/Poll";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import { useTranslation } from "react-i18next";

export interface ParticipantPollEventProps {
  token: string;
  event: ParticipantEvent;
  onPollFinished: () => void;
}

const ParticipantPollEvent = ({
  token,
  event,
  onPollFinished,
}: ParticipantPollEventProps): ReactElement => {
  const { t } = useTranslation("common");
  const pollData: Poll = event.eventData as Poll;
  const [choosenOptionsIds, setChoosenOptionsIds] = useState<string[]>([]);
  const [submitPollResultsMutation] = useSubmitPollResultsMutation();
  const selectOption = (option: PollOption): void => {
    if (!pollData.isMultiChoice) {
      setChoosenOptionsIds([option.id]);
      return;
    }
    if (choosenOptionsIds.some((id) => option.id === id)) {
      setChoosenOptionsIds((prev) => prev.filter(id => option.id !== id));
    } else {
      setChoosenOptionsIds([...choosenOptionsIds, option.id]);
    }
  };

  const onSubmit = (): void => {
    if (choosenOptionsIds.length > 0) {
      submitPollResultsMutation({
        variables: {
          token,
          input: {
            launchedEventId: event.id,
            pollOptionIds: choosenOptionsIds,
          },
        },
      });
      onPollFinished();
    }
  };

  const isChecked = (option: PollOption): boolean =>
    choosenOptionsIds.some((id) => option.id === id);

  const countdownTimer = useCountdownTimer({
    startValue: event.durationTimeSec,
    onFinishCallback: onSubmit,
  });

  return (
    <Paper className="ParticipantPollEvent" elevation={2}>
      <div className="header">
        <Typography variant="h5" className="headerText">
          <PollIcon className="pollIcon" />
          {event.name}
        </Typography>
      </div>
      <div className="participantPollQuestion">
        <Typography variant="h6" className="pollQuestion">
          {pollData.question}
        </Typography>
        <div className="answerList">
          <List>
            {pollData.options.map((option) => (
              <PollEventOption
                key={option.id}
                option={option}
                onCheck={() => selectOption(option)}
                isChecked={isChecked(option)}
              />
            ))}
          </List>
        </div>
      </div>
      <div className="submitRow">
        <Typography variant="h5">{countdownTimer}</Typography>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          {t("components.ParticipantActiveSession.submit")}
        </Button>
      </div>
    </Paper>
  );
};

export default ParticipantPollEvent;
