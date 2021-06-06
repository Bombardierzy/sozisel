import { useEffect, useState } from "react";

export interface UseCountdownTimerProps {
  startValue: number;
  onFinishCallback: () => void;
}
export default function useCountdownTimer({
  startValue,
  onFinishCallback,
}: UseCountdownTimerProps): string {
  const [secondsLeft, setSecondsLeft] = useState<number>(startValue);

  useEffect(() => {
    let mounted = true;
    if (secondsLeft !== 0) {
      setTimeout(() => {
        if (mounted) {
          setSecondsLeft(secondsLeft - 1);
        }
      }, 1000);
    } else {
      onFinishCallback();
    }
    return function cleanup() {
      mounted = false;
    };
  }, [secondsLeft, onFinishCallback]);

  return `${
    secondsLeft / 60 < 10
      ? `0${Math.floor(secondsLeft / 60)}`
      : Math.floor(secondsLeft / 60)
  }:${secondsLeft % 60 < 10 ? `0${secondsLeft % 60}` : secondsLeft % 60}`;
}
