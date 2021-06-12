import "./EventsTimeline.scss";
import "moment-timezone";

import * as moment from "moment";

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
import { Participant } from "../../../hooks/useLiveSessionParticipation";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import QuizDetails from "./QuizDetails/QuizDetails";
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

export default function EventsTimeline({
  events,
  launchedEvents,
  sessionId,
  participants,
}: EventsTimelineProps): ReactElement {
  const { t } = useTranslation("common");
  const [activeEventIdx, setActiveEventIdx] = useState<number>(0);
  const [activeEventId, setActiveEventId] = useState<string>("");
  const [activeEventCurrentSec, setActiveEventCurrentSec] = useState<number>(0);
  const history = useHistory();

  const [endSessionMutation, { error: endSessionError }] =
    useEndSessionMutation();

  const onEndSession = async () => {
    await endSessionMutation({ variables: { id: sessionId } });
    if (!endSessionError) {
      history.push("/sessions");
    }
  };

  useEffect(() => {
    const lastEventIdx = launchedEvents.length - 1;
    if (lastEventIdx >= 0) {
      const lastEvent = launchedEvents[launchedEvents.length - 1];
      const lastEventStartTime = moment.tz(
        lastEvent.insertedAt,
        "Europe/Warsaw"
      );
      const currentTime = Math.floor(
        moment
          .duration(moment.tz("Europe/Warsaw").diff(lastEventStartTime))
          .asSeconds()
      );
      if (currentTime < events[lastEventIdx].eventData.durationTimeSec) {
        setActiveEventIdx(lastEventIdx);
        setActiveEventId(lastEvent.id);
        setActiveEventCurrentSec(
          events[lastEventIdx].eventData.durationTimeSec - currentTime
        );
      } else {
        setActiveEventIdx(lastEventIdx + 1);
      }
    }
  }, [activeEventIdx, events, launchedEvents]);

  const [launchEventMutation, { error: launchEventError }] =
    useLaunchEventMutation();

  const onNextEvent = async () => {
    const {
      id,
      eventData: { targetPercentageOfParticipants },
    } = events[activeEventIdx];
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
    if (!launchEventError && activeEventIdx < events.length) {
      setActiveEventCurrentSec(
        events[activeEventIdx].eventData.durationTimeSec
      );
      setActiveEventId(events[activeEventIdx].id);
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
      <Stepper activeStep={activeEventIdx} alternativeLabel className="stepper">
        {events.map(({ name, id, startMinute }, idx) => (
          <Step key={id}>
            <StepLabel className="label">
              {name + " - "}
              <b>
                {t("components.PresenterSession.EventsTimeline.startMinute", {
                  value: startMinute,
                })}
              </b>
              {idx === activeEventIdx && !activeEventId && (
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
      {activeEventIdx < events.length && (
        <div className="eventDetails">
          {!activeEventId &&
            events[activeEventIdx].eventData.__typename === "Quiz" && (
              <>
                <Typography className="eventDetailsHeader">
                  {t(
                    "components.PresenterSession.EventsTimeline.eventDetailsHeader"
                  )}
                </Typography>
                <QuizDetails quiz={events[activeEventIdx].eventData} />
              </>
            )}
        </div>
      )}
      <div className="endSessionContainer">
        <Button color="primary" variant="contained" onClick={onEndSession}>
          {t("components.PresenterSession.EventsTimeline.endSessionButton")}
        </Button>
      </div>
      {activeEventId && (
        <Timer
          startValue={activeEventCurrentSec}
          onFinishCallback={() => {
            setActiveEventId("");
            if (activeEventIdx < events.length - 1) {
              setActiveEventIdx(activeEventIdx + 1);
            }
          }}
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
