import {
  ParticipantQuizAnswerInput,
  ParticipantQuizQuestion,
} from "../../graphql";

export type ParticipantQuizActions =
  | { type: "SELECT_ANSWER"; answerId: string; reactionTime: number }
  | { type: "UNSELECT_ANSWER"; answerId: string; reactionTime: number }
  | {
      type: "NEXT_QUESTION";
      question: ParticipantQuizQuestion;
      answerTime: number;
    }
  | { type: "SET_QUESTION"; question: ParticipantQuizQuestion };

export interface ParticipantQuizStoreInterface {
  currentQuestion: ParticipantQuizQuestion;
  currentAnswer: ParticipantQuizAnswerInput;
  answers: ParticipantQuizAnswerInput[];
}

export const participantQuizInitialState =
  (): ParticipantQuizStoreInterface => ({
    currentQuestion: { question: "", answers: [], id: "" },
    currentAnswer: {
      finalAnswerIds: [],
      questionId: "",
      trackNodes: [],
      answerTime: 0,
    },
    answers: [],
  });

export default function participantQuizReducer(
  state: ParticipantQuizStoreInterface,
  action: ParticipantQuizActions
): ParticipantQuizStoreInterface {
  switch (action.type) {
    case "SET_QUESTION":
      return {
        ...state,
        currentQuestion: action.question,
        currentAnswer: {
          answerTime: 0,
          finalAnswerIds: [],
          questionId: action.question.id,
          trackNodes: [],
        },
      };
    case "SELECT_ANSWER":
      return {
        ...state,
        currentAnswer: selectAnswer(
          state.currentAnswer,
          action.answerId,
          action.reactionTime
        ),
      };
    case "UNSELECT_ANSWER":
      return {
        ...state,
        currentAnswer: unselectAnswer(
          state.currentAnswer,
          action.answerId,
          action.reactionTime
        ),
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestion: action.question,
        currentAnswer: {
          finalAnswerIds: [],
          questionId: action.question.id,
          trackNodes: [],
          answerTime: 0,
        },
        answers: [
          ...state.answers,
          submitAnswer(state.currentAnswer, action.answerTime),
        ],
      };
    default:
      return state;
  }
}

const submitAnswer = (
  currentAnswer: ParticipantQuizAnswerInput,
  answerTime: number
): ParticipantQuizAnswerInput => {
  currentAnswer.answerTime = answerTime;
  return currentAnswer;
};

const selectAnswer = (
  currentAnswer: ParticipantQuizAnswerInput,
  answerId: string,
  reactionTime: number
) => {
  currentAnswer.finalAnswerIds.push(answerId);
  currentAnswer.trackNodes?.push({
    answerId: answerId,
    selected: true,
    reactionTime: reactionTime,
  });
  return currentAnswer;
};

const unselectAnswer = (
  currentAnswer: ParticipantQuizAnswerInput,
  answerId: string,
  reactionTime: number
) => {
  currentAnswer.finalAnswerIds = currentAnswer.finalAnswerIds.filter(
    (element) => element !== answerId
  );
  currentAnswer.trackNodes?.push({
    answerId: answerId,
    selected: false,
    reactionTime: reactionTime,
  });
  return currentAnswer;
};
