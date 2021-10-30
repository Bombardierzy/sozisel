import "./EventsTimeline.scss";

import {
  Button,
  IconButton,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { Event, Quiz } from "../../../model/Template";
import {
  EventType,
  useGetEventTypename,
} from "../../../hooks/useGetEventTypename";
import React, { ReactElement, useEffect, useState } from "react";
import {
  useEndSessionMutation,
  useLaunchEventMutation,
} from "../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import { Alert } from "@material-ui/lab";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import EventDetails from "./EventDetails/EventsDetails";
import LiveEventDetails from "./LiveEventDetails/LiveEventDetails";
import { Participant } from "../../../hooks/useLiveSessionParticipation";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import SoziselCard from "../../utils/Card/SoziselCard";
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

  const eventType = useGetEventTypename(events[activeEvent.idx]);

  const onEndSession = async () => {
    try {
      await endSessionMutation({ variables: { id: sessionId } });
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
      const durationTimeSec = events[lastEventIdx].durationTimeSec;

      setActiveEvent({
        idx: currentTime < durationTimeSec ? lastEventIdx : lastEventIdx + 1,
        id: lastEvent.id,
        currentSec: Math.max(0, durationTimeSec - currentTime),
      });
    }
  }, [events, launchedEvents]);

  const onNextEvent = async () => {
    let broadcast: boolean = false;
    let targetParticipants: string[] = [];

    const event: Event = events[activeEvent.idx];

    switch (eventType) {
      case EventType.Quiz: {
        const targetPercentageOfParticipants = (event.eventData as Quiz)
          .targetPercentageOfParticipants;

        broadcast = targetPercentageOfParticipants === 100;
        targetParticipants = getRandomParticipants(
          participants,
          targetPercentageOfParticipants
        );
        break;
      }
      case EventType.Poll: {
        broadcast = true;
        break;
      }
      case EventType.Whiteboard: {
        broadcast = true;
        break;
      }
    }

    await launchEventMutation({
      variables: {
        broadcast,
        targetParticipants,
        eventId: event.id,
        sessionId,
      },
    });
    if (!launchEventError && activeEvent.idx < events.length) {
      setActiveEvent({
        ...activeEvent,
        currentSec: events[activeEvent.idx].durationTimeSec,
        id: events[activeEvent.idx].id,
      });
    }
  };

  return (
    <div className="EventsTimeline">
      <SoziselCard>
        <div>
          <div className="header">
            <CalendarTodayIcon className="icon" />
            <Typography>
              {t("components.PresenterSession.EventsTimeline.header")}
            </Typography>
          </div>
          {!activeEvent.id && (
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
                      {t(
                        "components.PresenterSession.EventsTimeline.startMinute",
                        {
                          value: startMinute,
                        }
                      )}
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
          )}
          {activeEvent.idx < events.length && (
            <EventDetails
              activeEvent={events[activeEvent.idx]}
              activeEventId={activeEvent.id}
            />
          )}
          <div className="actionButtons">
            <Button
              color="primary"
              variant="contained"
              onClick={onEndSession}
              className="endSessionButton"
            >
              {t("components.PresenterSession.EventsTimeline.endSessionButton")}
            </Button>
          </div>
          {activeEvent.id && (
            <LiveEventDetails
              onFinishCallback={onFinishCallback}
              activeEvent={activeEvent}
              sessionId={sessionId}
              event={events[activeEvent.idx]}
              participantsNumber={participants.length}
            />
          )}
          <Snackbar
            open={!!launchEventError}
            autoHideDuration={AUTO_HIDE_DURATION}
          >
            <Alert severity="error">
              {t("components.PresenterSession.EventsTimeline.launchEventError")}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!endSessionError}
            autoHideDuration={AUTO_HIDE_DURATION}
          >
            <Alert severity="error">
              {t("components.PresenterSession.EventsTimeline.endSessionError")}
            </Alert>
          </Snackbar>
        </div>
      </SoziselCard>
    </div>
  );
}
