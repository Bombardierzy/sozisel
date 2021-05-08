import "./Question.scss";

import { InputAdornment, TextField } from "@material-ui/core";
import React, { ReactElement } from "react";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import ClearIcon from "@material-ui/icons/Clear";
import { QuizQuestionType } from "../../../../../model/Quiz";
import { useQuizContext } from "../../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface NewQuestionProp {
  answersCounter: number;
  setAnswersCounter: (state: number) => void;
  question: QuizQuestionType;
}

export default function Question({
  question,
  answersCounter,
  setAnswersCounter,
}: NewQuestionProp): ReactElement {
  const { t } = useTranslation("common");
  const [, dispatch] = useQuizContext();
  return (
    <div className="Question">
      <div className="buttonRight">
        <ClearIcon
          color="primary"
          className="check"
          onClick={() => dispatch({ type: "DELETE_QUESTION", question })}
        />
      </div>
      <TextField
        size="small"
        variant="outlined"
        className="question"
        value={question.question}
        error={question.question === ""}
        helperText={question.question === "" && t("inputErrors.fieldRequired")}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_QUESTION",
            question: { ...question, question: e.target.value },
          })
        }
      />

      {question.answers.map((answer, idx) => (
        <TextField
          key={idx}
          size="small"
          value={answer.text}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_ANSWER",
              answer: { ...answer, text: e.target.value },
              question,
            })
          }
          variant="outlined"
          onClick={() =>
            dispatch({
              type: "TOGGLE_CORRECT_ANSWER",
              question,
              correctAnswer: answer,
            })
          }
          className={`answer ${
            question.correctAnswers.includes(answer) && "correctAnswer"
          }`}
          error={answer.text === ""}
          helperText={answer.text === "" && t("inputErrors.fieldRequired")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{alphabet[idx]}</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <ClearIcon
                  color="primary"
                  className="check"
                  onClick={() =>
                    dispatch({ type: "DELETE_ANSWER", question, answer })
                  }
                />
              </InputAdornment>
            ),
          }}
        />
      ))}

      <div className="buttonFlex">
        <AddCircleIcon
          fontSize="large"
          className="addButton"
          color="primary"
          onClick={() => {
            setAnswersCounter(answersCounter + 1);
            dispatch({
              type: "ADD_ANSWER",
              question,
              answer: {
                id: answersCounter + 1,
                text: t(
                  "components.TemplateCreation.Quiz.Question.defaultAnswer"
                ),
              },
            });
          }}
        />
      </div>
    </div>
  );
}
