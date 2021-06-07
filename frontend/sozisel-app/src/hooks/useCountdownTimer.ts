import { useEffect, useState } from "react";

export interface UseCountdownTimerProps {
  startValue: number;
  onFinishCallback: () => void;
}

function formatTimer(secondsLeft: number): string {
  return `${
    secondsLeft / 60 < 10
      ? `0${Math.floor(secondsLeft / 60)}`
      : Math.floor(secondsLeft / 60)
  }:${secondsLeft % 60 < 10 ? `0${secondsLeft % 60}` : secondsLeft % 60}`;
}
export default function useCountdownTimer({
  startValue,
  onFinishCallback,
}: UseCountdownTimerProps): string {
  const [secondsLeft, setSecondsLeft] = useState<number>(startValue);
  const [timerText, setTimerText] = useState<string>(formatTimer(secondsLeft));

  useEffect(() => {
    let mounted = true;
    if (secondsLeft !== 0) {
      setTimeout(() => {
        if (mounted) {
          setTimerText(formatTimer(secondsLeft - 1));
          setSecondsLeft(secondsLeft - 1);
        }
      }, 1000);
    } else {
      onFinishCallback();
    }
    return () => {
      mounted = false;
    };
  }, [secondsLeft, onFinishCallback]);

  return timerText;
}
