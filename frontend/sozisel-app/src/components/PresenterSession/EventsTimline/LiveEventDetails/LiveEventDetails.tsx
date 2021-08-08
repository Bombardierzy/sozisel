import './LiveEventDetails.scss';

import React, { ReactElement } from "react";

import { ActiveEvent } from '../EventsTimeline';
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import useFetchEventLiveResult from "../../../../hooks/useFetchEventLiveResult";

interface LiveEventDetailsProps {
  activeEvent: ActiveEvent;
  onFinishCallback: () => void;
  sessionId: string;
}

interface TimerProps {
  onFinishCallback: () => void;
  startValue: number;
}

const Timer = ({ onFinishCallback, startValue }: TimerProps): ReactElement => {
  const countdownTimer = useCountdownTimer({
    startValue,
    onFinishCallback,
  });

  return <span className="Timer">{countdownTimer}</span>;
};

export default function LiveEventDetails({
  activeEvent,
  onFinishCallback,
  sessionId,
}: LiveEventDetailsProps): ReactElement {

  useFetchEventLiveResult(sessionId, activeEvent.id);

  return (
    <div className="LiveEventsDetails">
      <span className="title">
        Pozostały czas :{" "}
        <Timer startValue={activeEvent.currentSec} onFinishCallback={onFinishCallback} />
      </span>
    </div>
  );
}
