export interface QuizType {
  durationTime: number;
  percentageOfParticipants: number;
  trackingMode: boolean;
  questions: QuizQuestionType[];
}

export interface QuizQuestionType {
  id: number;
  question: string;
  answers: Answer[];
  correctAnswers: Answer[];
}

export interface Answer {
  id: number;
  text: string;
}
