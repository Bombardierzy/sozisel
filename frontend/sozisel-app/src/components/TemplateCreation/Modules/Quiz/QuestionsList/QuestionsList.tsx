import "./QuestionsList.scss";

import React, { ReactElement, useState } from "react";

import { Button } from "@material-ui/core";
import Question from "../Question/Question";
import { QuizQuestionType } from "../../../../../model/Quiz";
import { initialQuestion } from "../../../../../contexts/Quiz/quizReducer";
import { useQuizContext } from "../../../../../contexts/Quiz/QuizContext";

export default function QuestionList(): ReactElement {
  const [answersCounter, setAnswersCounter] = useState<number>(0);
  const [{ questions }, dispatch] = useQuizContext();

  return (
    <div className="QuestionsList">
      {questions.map((question: QuizQuestionType) => (
        <Question
          key={question.id}
          question={question}
          answersCounter={answersCounter}
          setAnswersCounter={setAnswersCounter}
        />
      ))}

      <Button
        color="primary"
        variant="contained"
        className="addNewQuestion"
        onClick={() =>
          dispatch({
            type: "ADD_QUESTION",
            question: { ...initialQuestion, id: questions.length + 1 },
          })
        }
      >
        {"Dodaj kolejne pytanie"}
      </Button>
    </div>
  );
}
