import "./ParticipantQuizQuestion.scss";
import { Answer, ParticipantQuizQuestion } from "../../../../../graphql";
import { Button, List, Typography } from "@material-ui/core";

import { ReactElement } from "react";
import { useParticipantQuizContext } from "../../../../../contexts/ParticipantQuiz/ParticipantQuizContext";

export default function ParticipantQuizQuestion(): ReactElement {
  const [
    { currentQuestion, currentAnswer },
    dispatch,
  ] = useParticipantQuizContext();
  const quizAnswer = (answer: Answer) => {
    const isSelected = currentAnswer.finalAnswerIds.includes(answer.id);
    return (
      <div key={answer.id} className="quizAnswer">
        <Button
          variant="outlined"
          color={isSelected ? "primary" : "default"}
          onClick={() =>
            dispatch({
              type: isSelected ? "UNSELECT_ANSWER" : "SELECT_ANSWER",
              answerId: answer.id,
              reactionTime: 2,
            })
          }
        >
          {answer.text}
        </Button>
      </div>
    );
  };
  return (
    <>
      <div className="ParticipantQuizQuestion">
        <Typography variant="h6" className="quizQuestion">
          {currentQuestion.question}
        </Typography>
        <div className="answerList">
          <List>
            {currentQuestion.answers.map((value, _) => quizAnswer(value))}
          </List>
        </div>
      </div>
    </>
  );
}
