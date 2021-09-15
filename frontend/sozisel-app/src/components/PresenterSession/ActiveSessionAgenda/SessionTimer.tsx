import "./SessionTimer.scss";

import { ReactElement, useEffect, useMemo, useState } from "react";

import { formatTimestamp } from "../../../common/utils";

interface SessionTimerProps {
  startTime: string;
}

export function SessionTimer({ startTime }: SessionTimerProps): ReactElement {
  const [seconds, setSeconds] = useState<number>(0);

  const formatted = useMemo(() => {
    return formatTimestamp(seconds);
  }, [seconds]);

  useEffect(() => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = now.getTime() / 1000 - start.getTime() / 1000;

    setSeconds(diff);

    const interval = setInterval(
      () => setSeconds((seconds) => seconds + 1),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return <div className="SessionTimer">{formatted}</div>;
}
