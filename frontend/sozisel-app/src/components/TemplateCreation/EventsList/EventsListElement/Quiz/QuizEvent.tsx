import "./QuizEvent.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Event, Quiz } from "../../../../../model/Template";
import React, { ReactElement, useState } from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Question from "./Question/Question";
import { useDeleteQuizMutation } from "../../../../../graphql";
import { useEventContext } from "../../../../../contexts/Event/EventContext";
import { useTranslation } from "react-i18next";

interface QuizProps {
  event: Event;
}

export default function QuizEvent({ event }: QuizProps): ReactElement {
  const eventData = event.eventData as Quiz;

  const [, dispatch] = useEventContext();
  const { t } = useTranslation("common");
  const [deleteQuizMutation] = useDeleteQuizMutation({
    refetchQueries: ["SessionTemplate"],
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const onEdit = () => {
    dispatch({
      type: "SET_EVENT",
      event: event as Event,
    });
  };

  return (
    <Accordion className="QuizEvent" expanded={isExpanded}>
      <AccordionSummary
        onClick={() => setIsExpanded(!isExpanded)}
        expandIcon={<ExpandMoreIcon />}
        className="accordionSummary"
      >
        <div className="accordionHeader">
          <HelpOutlineIcon className="logo" color="primary" />
          <div className="description">
            <Typography className="header">{event.name}</Typography>
            <Typography>
              {t("components.TemplateCreation.EventList.Quiz.startMinute", {
                value: event.startMinute,
              })}
            </Typography>
            <Typography>
              {t("components.TemplateCreation.EventList.Quiz.durationTime", {
                value: event.durationTimeSec,
              })}
            </Typography>
            <Typography>
              {t(
                "components.TemplateCreation.EventList.Quiz.percentageOfParticipants",
                { value: eventData.targetPercentageOfParticipants }
              )}
            </Typography>
          </div>
          <IconButton
            className="editButton"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            className="deleteButton"
            onClick={(e) => {
              e.stopPropagation();
              deleteQuizMutation({ variables: { id: event.id } });
              dispatch({ type: "RESET" });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </AccordionSummary>
      <AccordionDetails className="questions">
        {eventData.quizQuestions.map((question, idx: number) => (
          <Question key={idx} number={idx + 1} question={question} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
