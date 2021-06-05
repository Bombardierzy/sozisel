import "./Question.scss";

import { InputAdornment, TextField } from "@material-ui/core";
import React, { ReactElement } from "react";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import ClearIcon from "@material-ui/icons/Clear";
import { QuizQuestion } from "../../../../../model/Template";
import { useQuizContext } from "../../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface NewQuestionProp {
  question: QuizQuestion;
}

export default function Question({ question }: NewQuestionProp): ReactElement {
  const [, dispatch] = useQuizContext();
  const { t } = useTranslation("common");

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
        placeholder={t(
          "components.TemplateCreation.Quiz.Question.defaultQuestion"
        )}
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
          placeholder={t(
            "components.TemplateCreation.Quiz.Question.defaultAnswer"
          )}
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
            question.correctAnswers.filter(
              (correctAnswer) => correctAnswer.id === answer.id
            ).length > 0 && "correctAnswer"
          }`}
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
            dispatch({
              type: "ADD_ANSWER",
              question,
              answer: {
                id: uuidv4(),
                text: "",
              },
            });
          }}
        />
      </div>
    </div>
  );
}
