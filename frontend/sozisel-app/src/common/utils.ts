/**
 * Formats number of seconds into a valid time format.
 * @param timestamp
 * @returns string formatted time
 */
export function formatTimestamp(timestamp: number): string {
  const seconds = Math.floor(timestamp % 60);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const hours = Math.floor(timestamp / 3600);

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr = hoursStr && minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return hoursStr + minutesStr + secondsStr;
}
