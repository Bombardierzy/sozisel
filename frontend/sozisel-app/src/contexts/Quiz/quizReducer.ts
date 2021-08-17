import { Answer, QuizQuestion } from "../../model/Template";

import omitDeep from "omit-deep-lodash";
import { v4 as uuidv4 } from "uuid";

export type QuizActions =
  | { type: "ADD_ANSWER"; answer: Answer; question: QuizQuestion }
  | { type: "SET_PERCENTAGE_OF_PARTICIPANTS"; percentageOfParticipants: number }
  | { type: "SET_QUESTIONS"; questions: QuizQuestion[] }
  | { type: "RESET" }
  | { type: "DELETE_ANSWER"; answer: Answer; question: QuizQuestion }
  | { type: "UPDATE_ANSWER"; answer: Answer; question: QuizQuestion }
  | {
      type: "TOGGLE_CORRECT_ANSWER";
      correctAnswer: Answer;
      question: QuizQuestion;
    }
  | {
      type: "DELETE_CORRECT_ANSWER";
      correctAnswer: Answer;
      question: QuizQuestion;
    }
  | { type: "ADD_QUESTION"; question: QuizQuestion }
  | { type: "UPDATE_QUESTION"; question: QuizQuestion }
  | { type: "DELETE_QUESTION"; question: QuizQuestion };

export interface QuizStoreInterface {
  questions: QuizQuestion[];
  percentageOfParticipants: number;
}

export const initialQuestion = (): QuizQuestion => ({
  id: uuidv4(),
  question: "",
  answers: [{ id: uuidv4(), text: "" }],
  correctAnswers: [],
});

export const quizInitialState = (): QuizStoreInterface => ({
  questions: [initialQuestion()],
  percentageOfParticipants: 0,
});

export default function quizReducer(
  state: QuizStoreInterface = quizInitialState(),
  action: QuizActions
): QuizStoreInterface {
  switch (action.type) {
    case "ADD_ANSWER":
      return {
        ...state,
        questions: addAnswer(state.questions, action.question, action.answer),
      };
    case "SET_PERCENTAGE_OF_PARTICIPANTS":
      return {
        ...state,
        percentageOfParticipants: action.percentageOfParticipants,
      };
    case "SET_QUESTIONS":
      return {
        ...state,
        // This is a hack so that when we load questions from an already existing quiz event
        // the update mutation does not throw strange errors
        questions: action.questions.map(
          (q) => omitDeep(q, "__typename") as QuizQuestion
        ),
      };
    case "UPDATE_ANSWER":
      return {
        ...state,
        questions: updateAnswer(
          state.questions,
          action.question,
          action.answer
        ),
      };
    case "DELETE_ANSWER":
      return {
        ...state,
        questions: deleteQuestionAnswer(
          state.questions,
          action.question,
          action.answer
        ),
      };
    case "TOGGLE_CORRECT_ANSWER":
      return {
        ...state,
        questions: toggleCorrectAnswer(
          state.questions,
          action.question,
          action.correctAnswer
        ),
      };
    case "ADD_QUESTION":
      return { ...state, questions: [...state.questions, action.question] };
    case "RESET":
      return quizInitialState();
    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question.id !== action.question.id
        ),
      };
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.id === action.question.id ? action.question : question
        ),
      };
    default:
      return state;
  }
}

const addAnswer = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  answer: Answer
) =>
  questions.map((element) =>
    element.id === question.id
      ? { ...element, answers: [...question.answers, answer] }
      : element
  );

const addCorrectAnswer = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  correctAnswer: Answer
) =>
  questions.map((element) =>
    element.id === question.id
      ? {
          ...element,
          correctAnswers: [...question.correctAnswers, correctAnswer],
        }
      : element
  );

const deleteQuestionAnswer = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  answer: Answer
) =>
  questions.map((element) =>
    question.id === element.id
      ? {
          ...question,
          answers: question.answers.filter((ele) => ele.id !== answer.id),
          correctAnswers: question.correctAnswers.filter(
            (ele) => ele.id !== answer.id
          ),
        }
      : element
  );

const setCorrectQuestionAnswers = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  correctAnswers: Answer[]
) =>
  questions.map((element) =>
    element.id === question.id
      ? { ...element, correctAnswers: correctAnswers }
      : element
  );

const deleteAnswer = (answers: Answer[], answer: Answer) =>
  answers.filter((element) => element.id !== answer.id);

const getQuestionCorrectAnswers = (
  questions: QuizQuestion[],
  question: QuizQuestion
) =>
  questions.find((element) => element.id === question.id)?.correctAnswers || [];

const updateAnswer = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  answer: Answer
) =>
  questions.map((element) =>
    element.id === question.id
      ? {
          ...question,
          answers: question.answers.map((ele) =>
            answer.id === ele.id ? answer : ele
          ),
          correctAnswers: question.correctAnswers.map((ele) =>
            answer.id === ele.id ? answer : ele
          ),
        }
      : element
  );

const toggleCorrectAnswer = (
  questions: QuizQuestion[],
  question: QuizQuestion,
  correctAnswer: Answer
) => {
  if (
    question.correctAnswers.find((element) => element.id === correctAnswer.id)
  ) {
    return setCorrectQuestionAnswers(
      questions,
      question,
      deleteAnswer(
        getQuestionCorrectAnswers(questions, question),
        correctAnswer
      )
    );
  } else {
    return addCorrectAnswer(questions, question, correctAnswer);
  }
};
