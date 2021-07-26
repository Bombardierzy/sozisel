import "./EventsTimeline.scss";

import {
  Button,
  IconButton,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import {
  useEndSessionMutation,
  useLaunchEventMutation,
} from "../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import { Alert } from "@material-ui/lab";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Event } from "../../../model/Template";
import EventDetails from "./EventDetails/EventsDetails";
import { Participant } from "../../../hooks/useLiveSessionParticipation";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import useCountdownTimer from "../../../hooks/useCountdownTimer";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

interface LaunchedEvent {
  id: string;
  insertedAt: string;
}

interface EventsTimelineProps {
  events: Event[];
  launchedEvents: LaunchedEvent[];
  sessionId: string;
  participants: Participant[];
}

interface TimerProps {
  onFinishCallback: () => void;
  startValue: number;
}

const Timer = ({ onFinishCallback, startValue }: TimerProps): ReactElement => {
  const countdownTimer = useCountdownTimer({
    startValue,
    onFinishCallback,
  });

  return <p className="Timer">{countdownTimer}</p>;
};

const getRandomParticipants = (
  participants: Participant[],
  targetPercentageOfParticipants: number
): string[] => {
  return participants
    .sort(() => 0.5 - Math.random())
    .slice(
      0,
      Math.floor((targetPercentageOfParticipants / 100) * participants.length)
    )
    .map((participant) => participant.id);
};

export interface ActiveEvent {
  id: string;
  idx: number;
  currentSec: number;
}

export default function EventsTimeline({
  events,
  launchedEvents,
  sessionId,
  participants,
}: EventsTimelineProps): ReactElement {
  const { t } = useTranslation("common");
  const [activeEvent, setActiveEvent] = useState<ActiveEvent>({
    id: "",
    idx: 0,
    currentSec: 0,
  });
  const history = useHistory();

  const [endSessionMutation, { error: endSessionError }] =
    useEndSessionMutation();

  const [launchEventMutation, { error: launchEventError }] =
    useLaunchEventMutation();

  const onEndSession = async () => {
    try {
      await endSessionMutation({ variables: { id: "sessionId" } });
      history.push(`result/summary`);
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishCallback = () => {
    setActiveEvent({
      ...activeEvent,
      id: "",
      idx:
        activeEvent.idx < events.length ? activeEvent.idx + 1 : activeEvent.idx,
    });
  };

  useEffect(() => {
    const lastEventIdx = launchedEvents.length - 1;
    if (lastEventIdx >= 0) {
      const lastEvent = launchedEvents[launchedEvents.length - 1];

      const lastEventStartTime = new Date(lastEvent.insertedAt).getTime();
      const currentTime = Math.floor((Date.now() - lastEventStartTime) / 1000);

      setActiveEvent({
        idx:
          currentTime < events[lastEventIdx].eventData.durationTimeSec
            ? lastEventIdx
            : lastEventIdx + 1,
        id: lastEvent.id,
        currentSec:
          events[lastEventIdx].eventData.durationTimeSec - currentTime,
      });
    }
  }, [events, launchedEvents]);

  const onNextEvent = async () => {
    const {
      id,
      eventData: { targetPercentageOfParticipants },
    } = events[activeEvent.idx];
    await launchEventMutation({
      variables: {
        broadcast: targetPercentageOfParticipants === 100,
        eventId: id,
        sessionId,
        targetParticipants: getRandomParticipants(
          participants,
          targetPercentageOfParticipants
        ),
      },
    });
    if (!launchEventError && activeEvent.idx < events.length) {
      setActiveEvent({
        ...activeEvent,
        currentSec: events[activeEvent.idx].eventData.durationTimeSec,
        id: events[activeEvent.idx].id,
      });
    }
  };

  return (
    <Paper elevation={2} className="EventsTimeline">
      <div className="header">
        <CalendarTodayIcon className="icon" />
        <Typography>
          {t("components.PresenterSession.EventsTimeline.header")}
        </Typography>
      </div>
      <Stepper
        activeStep={activeEvent.idx}
        alternativeLabel
        className="stepper"
      >
        {events.map(({ name, id, startMinute }, idx) => (
          <Step key={id}>
            <StepLabel className="label">
              {name + " - "}
              <b>
                {t("components.PresenterSession.EventsTimeline.startMinute", {
                  value: startMinute,
                })}
              </b>
              {idx === activeEvent.idx && !activeEvent.id && (
                <IconButton
                  color="primary"
                  className="startEventButton"
                  onClick={onNextEvent}
                >
                  <PlayCircleFilledIcon />
                </IconButton>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeEvent.idx < events.length && (
        <EventDetails
          activeEvent={events[activeEvent.idx]}
          activeEventId={activeEvent.id}
        />
      )}
      <div className="endSessionContainer">
        <Button color="primary" variant="contained" onClick={onEndSession}>
          {t("components.PresenterSession.EventsTimeline.endSessionButton")}
        </Button>
      </div>
      {activeEvent.id && (
        <Timer
          startValue={activeEvent.currentSec}
          onFinishCallback={onFinishCallback}
        />
      )}
      <Snackbar open={!!launchEventError} autoHideDuration={AUTO_HIDE_DURATION}>
        <Alert severity="error">
          {t("components.PresenterSession.EventsTimeline.launchEventError")}
        </Alert>
      </Snackbar>
      <Snackbar open={!!endSessionError} autoHideDuration={AUTO_HIDE_DURATION}>
        <Alert severity="error">
          {t("components.PresenterSession.EventsTimeline.endSessionError")}
        </Alert>
      </Snackbar>
    </Paper>
  );
}