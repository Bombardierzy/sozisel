import "./Question.scss";

import {
  Checkbox,
  InputAdornment,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { ReactElement } from "react";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import ClearIcon from "@material-ui/icons/Clear";
import { QuizQuestion } from "../../../../../../model/Template";
import { useQuizContext } from "../../../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface NewQuestionProp {
  question: QuizQuestion;
}

export default function Question({ question }: NewQuestionProp): ReactElement {
  const [, dispatch] = useQuizContext();
  const { t } = useTranslation("common");

  return (
    <div className="Question">
      <div className="buttonRight">
        <Tooltip
          title={t<string>(
            "components.TemplateCreation.Quiz.Question.deleteQuestion"
          )}
        >
          <ClearIcon
            color="primary"
            className="check"
            onClick={() => dispatch({ type: "DELETE_QUESTION", question })}
          />
        </Tooltip>
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

      {question.answers.map((answer, idx) => {
        const isChecked =
          question.correctAnswers.filter(
            (correctAnswer) => correctAnswer.id === answer.id
          ).length > 0;

        return (
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
            className={`answer ${isChecked && "correctAnswer"}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    title={
                      isChecked
                        ? t<string>(
                            "components.TemplateCreation.Quiz.Question.uncheckCorrectAnswer"
                          )
                        : t<string>(
                            "components.TemplateCreation.Quiz.Question.checkCorrectAnswer"
                          )
                    }
                  >
                    <Checkbox
                      color="primary"
                      className="check"
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE_CORRECT_ANSWER",
                          question,
                          correctAnswer: answer,
                        })
                      }
                      checked={isChecked}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    title={t<string>(
                      "components.TemplateCreation.Quiz.Question.deleteAnswer"
                    )}
                  >
                    <ClearIcon
                      color="primary"
                      className="check"
                      onClick={() =>
                        dispatch({ type: "DELETE_ANSWER", question, answer })
                      }
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        );
      })}

      <div className="buttonFlex">
        <Tooltip
          title={t<string>(
            "components.TemplateCreation.Quiz.Question.addAnswer"
          )}
        >
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
        </Tooltip>
      </div>
    </div>
  );
}
