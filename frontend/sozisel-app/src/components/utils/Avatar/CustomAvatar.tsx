import { ReactElement } from "react";
import useAvatarById from "../../../hooks/useAvatarById";

export interface CustomAvatarProps {
  id: string;
  width?: number;
}
export default function CustomAvatar({
  id,
  width = 150,
}: CustomAvatarProps): ReactElement {
  const avatar = useAvatarById(id);
  return (
    <img width={width} src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
  );
}
