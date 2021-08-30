import "./Question.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
} from "@material-ui/core";
import React, { ReactElement } from "react";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { QuizQuestion } from "../../../../../model/Template";

interface QuestionProps {
  question: QuizQuestion;
  number: number;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Question({
  question,
  number,
}: QuestionProps): ReactElement {
  return (
    <Accordion className="QuestionContainer">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="header">
        {`${number}. ${question.question}`}
      </AccordionSummary>
      <AccordionDetails className="details">
        <List>
          {question.answers.map((answer, idx) => (
            <ListItem
              key={idx}
              className={
                question.correctAnswers.filter(
                  (correctAnswer) => correctAnswer.id === answer.id
                ).length > 0
                  ? "correctAnswer"
                  : ""
              }
            >
              {`${alphabet[idx]}. ${answer.text}`}
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
