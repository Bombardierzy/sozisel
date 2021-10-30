import "./QuizResultDetails.scss";

import { Card, CircularProgress, Typography } from "@material-ui/core";
import React, { useState } from "react";

import AssignmentIcon from "@material-ui/icons/Assignment";
import ErrorAlert from "../../../../../utils/Alerts/ErrorAlert";
import EventIcon from "@material-ui/icons/Event";
import PeopleIcon from "@material-ui/icons/People";
import QuizResultChartsView from "./QuizResultViews/Charts/QuizResultChartsView";
import QuizResultParticipantsView from "./QuizResultViews/Participants/QuizResultParticipantsView";
import QuizResultQuestionsView from "./QuizResultViews/Questions/QuizResultQuestionsView";
import ShadowBoxCard from "../../../../../utils/Card/ShadowBoxCard";
import StatsRow from "../../../../../utils/StatsRow/StatsRow";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useQuizSummaryQuery } from "../../../../../../graphql";
import { useTranslation } from "react-i18next";

export interface QuizResultDetailsProps {
  id: string;
  eventName: string;
}

enum QuizResultView {
  PARTICIPANTS,
  QUESTIONS,
  CHARTS,
}

export default function QuizResultDetails({
  id,
  eventName,
}: QuizResultDetailsProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { data, loading } = useQuizSummaryQuery({ variables: { id } });
  const [activeView, setActiveView] = useState<QuizResultView>(
    QuizResultView.PARTICIPANTS
  );
  const [raisedCard, setRaisedCard] = useState<QuizResultView | null>(null);

  const onMouseOverChange = (viewType: QuizResultView) => {
    setRaisedCard((prev) => (prev === viewType ? null : viewType));
  };

  if (loading) {
    return (
      <div className="QuizResultDetails">
        <CircularProgress />
      </div>
    );
  }

  if (data?.quizSummary) {
    return (
      <div className="QuizResultDetails">
        <div className="quizSummary">
          <ShadowBoxCard>
            <div className="quizSummaryContent">
              <div className="headerWithIcon">
                <EventIcon color="primary" fontSize="large" />
                <Typography variant="h3" className="header">
                  {eventName}
                </Typography>
              </div>
              <StatsRow
                label={t("components.SessionEventResults.Quiz.averagePoints")}
                value={`${data.quizSummary.averagePoints.toFixed(2)}`}
              />
              <StatsRow
                label={t(
                  "components.SessionEventResults.Quiz.averageAnswerTime"
                )}
                value={`${data.quizSummary.averageQuizAnswerTime.toFixed(2)}`}
              />
              <StatsRow
                label={t(
                  "components.SessionEventResults.Quiz.participantsNumber"
                )}
                value={`${data.quizSummary.numberOfParticipants}`}
              />
              <Typography className="chooseViewLabel">
                {t("components.SessionEventResults.Quiz.chooseView")}
              </Typography>
              <Card
                raised={raisedCard === QuizResultView.PARTICIPANTS}
                onMouseOver={(_e) =>
                  onMouseOverChange(QuizResultView.PARTICIPANTS)
                }
                onMouseOut={(_e) =>
                  onMouseOverChange(QuizResultView.PARTICIPANTS)
                }
                onClick={() => setActiveView(QuizResultView.PARTICIPANTS)}
                className={
                  "viewCard" +
                  (activeView === QuizResultView.PARTICIPANTS
                    ? " activeCard"
                    : "")
                }
              >
                <PeopleIcon />
                {t("components.SessionEventResults.Quiz.participants")}
              </Card>
              <Card
                raised={raisedCard === QuizResultView.QUESTIONS}
                onMouseOver={(_e) =>
                  onMouseOverChange(QuizResultView.QUESTIONS)
                }
                onMouseOut={(_e) => onMouseOverChange(QuizResultView.QUESTIONS)}
                onClick={() => setActiveView(QuizResultView.QUESTIONS)}
                className={
                  "viewCard" +
                  (activeView === QuizResultView.QUESTIONS ? " activeCard" : "")
                }
              >
                <AssignmentIcon />
                {t("components.SessionEventResults.Quiz.questions")}
              </Card>
              <Card
                raised={raisedCard === QuizResultView.CHARTS}
                onMouseOver={(_e) => onMouseOverChange(QuizResultView.CHARTS)}
                onMouseOut={(_e) => onMouseOverChange(QuizResultView.CHARTS)}
                onClick={() => setActiveView(QuizResultView.CHARTS)}
                className={
                  "viewCard" +
                  (activeView === QuizResultView.CHARTS ? " activeCard" : "")
                }
              >
                <TrendingUpIcon />
                {t("components.SessionEventResults.Quiz.charts")}
              </Card>
            </div>
          </ShadowBoxCard>
        </div>
        <div className="quizResultView">
          <ShadowBoxCard>
            <div>
              {activeView === QuizResultView.PARTICIPANTS && (
                <QuizResultParticipantsView id={id} />
              )}
              {activeView === QuizResultView.QUESTIONS && (
                <QuizResultQuestionsView id={id} />
              )}
              {activeView === QuizResultView.CHARTS && (
                <QuizResultChartsView id={id} />
              )}
            </div>
          </ShadowBoxCard>
        </div>
      </div>
    );
  }

  return (
    <div className="QuizResultDetails">
      <ErrorAlert />
    </div>
  );
}
