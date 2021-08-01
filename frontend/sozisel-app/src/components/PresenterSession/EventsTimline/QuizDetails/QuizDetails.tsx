import "./QuizDetails.scss";

import React, { ReactElement } from "react";

import { Quiz } from "../../../../model/Template";
import { useTranslation } from "react-i18next";

interface QuizDetailsProps {
  quiz: Quiz;
}

export default function QuizDetails({ quiz }: QuizDetailsProps): ReactElement {
  const { t } = useTranslation("common");
  return (
    <div className="QuizDetails">
      <div>
        <p>
          {t(
            "components.PresenterSession.EventsTimeline.QuizDetails.durationTime",
            { value: quiz.durationTimeSec }
          )}
        </p>
        <p>
          {t(
            "components.PresenterSession.EventsTimeline.QuizDetails.percentageOfParticipants",
            { value: quiz.targetPercentageOfParticipants }
          )}
        </p>
        <p>
          {t(
            "components.PresenterSession.EventsTimeline.QuizDetails.questionsNumber"
          )}
          {quiz.quizQuestions.length}
        </p>
      </div>
    </div>
  );
}
