import { AgendaPoint } from "./Agenda";

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
  startMinute: number;
}

export type EventData = Quiz;

export interface Quiz {
  __typename?: string;
  durationTimeSec: number;
  quizQuestions: QuizQuestion[];
  targetPercentageOfParticipants: number;
  trackingMode: boolean;
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
