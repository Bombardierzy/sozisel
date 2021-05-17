import { User } from "../graphql";

export interface Template {
  id: string;
  estimatedTime: number;
  isPublic: boolean;
  name: string;
  owner: User;
  agendaEntries: {
    id: string;
    name: string;
    startMinute: number;
  }[];
  events: {
    id: string;
    name: string;
    startMinute: number;
    eventData: any;
  }[];
}
