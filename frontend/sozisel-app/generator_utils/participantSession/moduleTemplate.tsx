import "./ModuleTemplate.scss";

import {
  ParticipantEvent,
} from "../../../../graphql";
import { ReactElement } from "react";

export interface ModuleTemplateProps {
  token: string;
  event: ParticipantEvent;
  onFinished: () => void;
}

export function ModuleTemplate({
  token,
  event,
  onFinished,
}: ModuleTemplateProps): ReactElement {
    // TODO add your implementation
    throw Error('Unimplemented function!');
};
