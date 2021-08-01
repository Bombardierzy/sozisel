import { ReactElement } from "react";
import useAvatarById from "../../../hooks/useAvatarById";

export interface CustomAvatarProps {
  id: string;
}
export default function CustomAvatar({ id }: CustomAvatarProps): ReactElement {
  const avatar = useAvatarById(id);
  return <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />;
}
