import "./ParticipantWhiteBoard.scss";
import { Button, Paper, Typography } from "@material-ui/core";
import {
  ParticipantEvent,
  Whiteboard,
  useSubmitWhiteboardResultMutation,
} from "../../../../graphql";
import { ReactElement, useMemo, useState } from "react";

import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import LatextText from "../../../utils/LatexText/LatextText";
import WhiteboardComponent from "./Whiteboard/Whiteboard";
import WhiteboardSwtich from "./WhiteboardSwitch/WhiteboardSwitch";
import { canvasManager } from "../../../WhiteBoard/services/CanvasManager";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import { useTranslation } from "react-i18next";

export interface ParticipantWhiteboardEventProps {
  token: string;
  event: ParticipantEvent;
  onWhiteboardFinished: () => void;
  withJitsi: boolean;
}

const ParticipantWhiteboardEvent = ({
  token,
  onWhiteboardFinished,
  event,
  withJitsi,
}: ParticipantWhiteboardEventProps): ReactElement => {
  const { t } = useTranslation("common");
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
  const whiteboardData: Whiteboard = event.eventData as Whiteboard;
  const startTime = useMemo(() => Date.now(), []);

  const [submitWhiteboardResultMutation] = useSubmitWhiteboardResultMutation();

  const countdownTimer = useCountdownTimer({
    startValue: event.durationTimeSec,
    onFinishCallback: () => onWhiteboardFinished(),
  });

  const onSubmit = async () => {
    const usedTime = (Date.now() - startTime) / 1000;
    const image = await canvasManager.canvasFile();
    submitWhiteboardResultMutation({
      variables: {
        token,
        input: {
          launchedEventId: event.id,
          usedTime,
          image,
          text: "",
        },
      },
    });
    onWhiteboardFinished();
  };

  if (!withJitsi && showWhiteboard) {
    return (
      <>
        <WhiteboardSwtich
          showWhiteboard={showWhiteboard}
          setShowWhiteboard={setShowWhiteboard}
        />
        <WhiteboardComponent token={token} withJitsi={withJitsi} />
      </>
    );
  }

  return (
    <Paper className="ParticipantWhiteboardEvent" elevation={2}>
      <div className="header">
        <Typography variant="h5" className="headerText">
          <EventOutlinedIcon className="eventIcon" />
          {event.name}
        </Typography>
      </div>
      <div className="question">
        <LatextText text={whiteboardData.task} />
      </div>
      <div className="submitRow">
        <Typography variant="h5">{countdownTimer}</Typography>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          {t("components.ParticipantActiveSession.submit")}
        </Button>
      </div>
      <WhiteboardSwtich
        showWhiteboard={showWhiteboard}
        setShowWhiteboard={setShowWhiteboard}
      />
      {showWhiteboard && (
        <WhiteboardComponent token={token} withJitsi={withJitsi} />
      )}
    </Paper>
  );
};

export default ParticipantWhiteboardEvent;
