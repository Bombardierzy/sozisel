import { AgendaPoint } from "./Agenda";
import { Poll } from "../graphql";

export interface SessionTemplate {
  id: string;
  agendaEntries: AgendaPoint[];
  estimatedTime: number;
  owner: Owner;
  events: Event[];
  isPublic: boolean;
  name: string;
}

export interface Event {
  id: string;
  eventData: EventData;
  name: string;
  durationTimeSec: number;
  startMinute: number;
}

export type EventData = Quiz | Poll;

// export interface Poll {
//   __typename?: string;
//   question: string;
//   isMultiChoice: boolean;
//   options: PollOption
// }

export interface Quiz {
  __typename?: string;
  quizQuestions: QuizQuestion[];
  targetPercentageOfParticipants: number;
}

export type QuizQuestion = {
  id: string;
  answers: Answer[];
  correctAnswers: Answer[];
  question: string;
};

export type Answer = {
  text: string;
  id: string;
};

export interface Owner {
  email: string;
  lastName: string;
  firstName: string;
  id: string;
}
