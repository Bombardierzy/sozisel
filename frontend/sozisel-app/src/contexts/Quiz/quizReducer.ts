import { Answer, QuizQuestionType } from "../../model/Quiz";

export type QuizActions =
  | { type: "ADD_ANSWER"; answer: Answer; question: QuizQuestionType }
  | { type: "DELETE_ANSWER"; answer: Answer; question: QuizQuestionType }
  | { type: "UPDATE_ANSWER"; answer: Answer; question: QuizQuestionType }
  | {
      type: "TOGGLE_CORRECT_ANSWER";
      correctAnswer: Answer;
      question: QuizQuestionType;
    }
  | {
      type: "DELETE_CORRECT_ANSWER";
      correctAnswer: Answer;
      question: QuizQuestionType;
    }
  | { type: "ADD_QUESTION"; question: QuizQuestionType }
  | { type: "UPDATE_QUESTION"; question: QuizQuestionType }
  | { type: "DELETE_QUESTION"; question: QuizQuestionType };

export interface QuizStoreInterface {
  questions: QuizQuestionType[];
}

export const initialQuestion = {
  id: 0,
  question: "Treść pytania...",
  answers: [{ id: 0, text: "Odpowiedź..." }],
  correctAnswers: [],
};

export const quizInitialState: QuizStoreInterface = {
  questions: [initialQuestion],
};

export default function quizReducer(
  state: QuizStoreInterface = quizInitialState,
  action: QuizActions
): QuizStoreInterface {
  switch (action.type) {
    case "ADD_ANSWER":
      return {
        questions: addAnswer(state.questions, action.question, action.answer),
      };
    case "UPDATE_ANSWER":
      return {
        questions: setQuestionAnswers(
          state.questions,
          action.question,
          updateAnswer(
            getQuestionAnswers(state.questions, action.question),
            action.answer
          )
        ),
      };
    case "DELETE_ANSWER":
      return {
        questions: deleteQuestionAnswer(
          state.questions,
          action.question,
          action.answer
        ),
      };
    case "TOGGLE_CORRECT_ANSWER":
      return {
        questions: toggleCorrectAnswer(
          state.questions,
          action.question,
          action.correctAnswer
        ),
      };
    case "ADD_QUESTION":
      return { questions: [...state.questions, action.question] };
    case "DELETE_QUESTION":
      return {
        questions: state.questions.filter(
          (question) => question.id !== action.question.id
        ),
      };
    case "UPDATE_QUESTION":
      return {
        questions: state.questions.map((question) =>
          question.id === action.question.id ? action.question : question
        ),
      };
    default:
      return state;
  }
}

const addAnswer = (
  questions: QuizQuestionType[],
  question: QuizQuestionType,
  answer: Answer
) =>
  questions.map((element) =>
    element.id === question.id
      ? { ...element, answers: [...question.answers, answer] }
      : element
  );

const addCorrectAnswer = (
  questions: QuizQuestionType[],
  question: QuizQuestionType,
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
  questions: QuizQuestionType[],
  question: QuizQuestionType,
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

const setQuestionAnswers = (
  questions: QuizQuestionType[],
  question: QuizQuestionType,
  answers: Answer[]
) =>
  questions.map((element) =>
    element.id === question.id ? { ...element, answers: answers } : element
  );

const setCorrectQuestionAnswers = (
  questions: QuizQuestionType[],
  question: QuizQuestionType,
  correctAnswers: Answer[]
) =>
  questions.map((element) =>
    element.id === question.id
      ? { ...element, correctAnswers: correctAnswers }
      : element
  );

const deleteAnswer = (answers: Answer[], answer: Answer) =>
  answers.filter((element) => element.id !== answer.id);

const getQuestionAnswers = (
  questions: QuizQuestionType[],
  question: QuizQuestionType
) => questions.find((element) => element.id === question.id)?.answers || [];

const getQuestionCorrectAnswers = (
  questions: QuizQuestionType[],
  question: QuizQuestionType
) =>
  questions.find((element) => element.id === question.id)?.correctAnswers || [];

const updateAnswer = (answers: Answer[], newAnswer: Answer) =>
  answers.map((element) => (element.id === newAnswer.id ? newAnswer : element));

const toggleCorrectAnswer = (
  questions: QuizQuestionType[],
  question: QuizQuestionType,
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
