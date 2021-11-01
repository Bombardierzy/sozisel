import React, { ReactElement } from "react";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";

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

export default Timer;
