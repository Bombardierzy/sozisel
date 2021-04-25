import { AgendaEntry } from "./AgendaEntry";
import { User } from "./User";

export interface SessionTemplate {
  id: string;
  estimatedTime: number;
  isPublic: boolean;
  name: string;
  owner: User;
  agendaEntries: AgendaEntry[];
}
