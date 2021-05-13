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
  durationTimeSec: number;
  quizQuestions: Array<QuizQuestion>;
  targetPercentageOfParticipants: number;
  trackingMode: boolean;
}

export type QuizQuestion = {
  answers: string[];
  correctAnswers: string[];
  question: string;
};

export interface Owner {
  email: string;
  lastName: string;
  firstName: string;
  id: string;
}
