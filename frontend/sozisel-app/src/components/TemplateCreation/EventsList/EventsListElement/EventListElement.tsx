import "./EventListElement.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Event } from "../../../../model/Template";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Question from "./Quiz/Question/Question";
import { useEventContext } from "../../../../contexts/Event/EventContext";
import { useTranslation } from "react-i18next";

const EventHeaders: FC<{ event: Event }> = ({ event }) => {
  const { t } = useTranslation("common");

  switch (event.eventData.__typename) {
    case "Quiz": {
      return (
        <>
          <Typography>
            {t(
              "components.TemplateCreation.EventList.Quiz.percentageOfParticipants",
              { value: event.eventData.targetPercentageOfParticipants }
            )}
          </Typography>
        </>
      );
    }
    case "Poll": {
      return <></>;
    }

    default: {
      return <></>;
    }
  }
};

const EventElementDetails: FC<{ event: Event }> = ({ event }) => {
  switch (event.eventData.__typename) {
    case "Quiz": {
      return (
        <>
          {event.eventData.quizQuestions.map((question, idx: number) => (
            <Question key={idx} number={idx + 1} question={question} />
          ))}
        </>
      );
    }
    default: {
      return <></>;
    }
  }
};

interface EventListElementProps {
  event: Event;
  onDelete: (eventId: string) => void;
}

export default function EventListElement({
  event,
  onDelete,
}: EventListElementProps): ReactElement {
  const [, dispatch] = useEventContext();
  const { t } = useTranslation("common");

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const onEdit = () => {
    dispatch({
      type: "SET_EVENT",
      event: event as Event,
    });
  };

  return (
    <Accordion className="EventListElement" expanded={isExpanded}>
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
              {t(
                `components.TemplateCreation.EventList.type.${event.eventData.__typename}`
              )}
            </Typography>
            <Typography>
              {t("components.TemplateCreation.EventList.startMinute", {
                value: event.startMinute,
              })}
            </Typography>
            <Typography>
              {t("components.TemplateCreation.EventList.durationTime", {
                value: event.durationTimeSec,
              })}
            </Typography>
            <EventHeaders event={event} />
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
              onDelete(event.id);
              dispatch({ type: "RESET" });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </AccordionSummary>
      <AccordionDetails className="questions">
        <EventElementDetails event={event} />
      </AccordionDetails>
    </Accordion>
  );
}
