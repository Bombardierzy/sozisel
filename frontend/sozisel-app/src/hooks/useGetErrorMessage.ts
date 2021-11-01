import { ApolloError } from "@apollo/client";
import { useTranslation } from "react-i18next";

enum ErrorType {
  UNAUTHOZIED = "unauthorized",
  UPDATE_EVENT_ERROR = "can't update event which has already existing event results",
  QUIZ_BLANK_CORRECT_ANSWER_TEXT_ERROR = "correct_answers: text can't be blank",
  QUIZ_BLANK_ANSWER_TEXT_ERROR = "answers: text can't be blank",
}

const useGetErrorMessage = (): ((error?: ApolloError) => string) => {
  const { t } = useTranslation("common");

  const getErrorMessage = (error?: ApolloError) => {
    if (!error) return "";

    if (error.message.includes(ErrorType.UNAUTHOZIED)) {
      return t("inputErrors.incorrectLoginData");
    } else if (error.message.includes(ErrorType.UPDATE_EVENT_ERROR)) {
      return t("inputErrors.updateEventError");
    } else if (
      error.message.includes(ErrorType.QUIZ_BLANK_ANSWER_TEXT_ERROR) ||
      error.message.includes(ErrorType.QUIZ_BLANK_CORRECT_ANSWER_TEXT_ERROR)
    ) {
      return t("inputErrors.quizBlankAnswerTextError");
    }

    return "";
  };

  return getErrorMessage;
};

export default useGetErrorMessage;
