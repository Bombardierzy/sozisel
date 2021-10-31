import "./QuestionsList.scss";

import React, { ReactElement } from "react";

import { Button } from "@material-ui/core";
import Question from "../Question/Question";
import { QuizQuestion } from "../../../../../../model/Template";
import { initialQuestion } from "../../../../../../contexts/Quiz/quizReducer";
import { useQuizContext } from "../../../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

export default function QuestionList(): ReactElement {
  const [{ questions }, dispatch] = useQuizContext();
  const { t } = useTranslation("common");
  return (
    <div className="QuestionsList">
      {questions.map((question: QuizQuestion) => (
        <Question key={question.id} question={question} />
      ))}

      <Button
        color="primary"
        variant="contained"
        className="addNewQuestion"
        onClick={() =>
          dispatch({
            type: "ADD_QUESTION",
            question: { ...initialQuestion(), id: uuidv4() },
          })
        }
      >
        {t("components.TemplateCreation.EventList.Quiz.addNewQuestion")}
      </Button>
    </div>
  );
}
