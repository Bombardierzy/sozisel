import { getAvatarFromData } from "@fractalsoftware/random-avatar-generator";

export default function useAvatarById(id: string): string {
  let asciiSum = id
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((sum, value) => sum + value);
  const complexity = 10;
  const avatarDataSeparator = "-";
  const xAxis = Math.floor(asciiSum * Math.pow(2, complexity - 1));
  const yAxis = Math.floor(asciiSum * (Math.pow(2, complexity) - 1)) + 1;

  const rows = yAxis.toString(2).padStart(complexity, "0").split("");
  let ret = `${xAxis.toString(36)}${avatarDataSeparator}${yAxis.toString(36)}`;
  let color;

  let factor = complexity;
  rows.forEach(() => {
    color = (asciiSum * factor) % 16777215;
    factor = color;
    ret += `${avatarDataSeparator}${color.toString(36)}`;
  });
  return getAvatarFromData(ret, "square", 256);
}
