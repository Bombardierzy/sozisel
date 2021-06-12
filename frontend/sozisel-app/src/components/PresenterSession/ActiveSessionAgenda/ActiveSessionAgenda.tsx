import "./ActiveSessionAgenda.scss";

import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";

import { AgendaPoint } from "../../../model/Agenda";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import { useTranslation } from "react-i18next";

interface ActiveSessionAgendaProps {
  agendaEntries: AgendaPoint[];
  estimatedTimeInSeconds: number;
  sessionStartDate: Date;
}

interface ActiveSessionAgendaEntryProps {
  startMinute: number;
  endMinute: number;
  name: string;
  idx: number;
}

const ON_GOING: string = "onGoing";
const ENDED: string = "ended";

const getSessionCurrentMinute = (sessionStartDate: Date) => {
  const localTime: Date = new Date();
  // convert from milliseconds to minutes
  return (localTime.getTime() - sessionStartDate.getTime()) / (1000 * 60);
};

export default function ActiveSessionAgenda({
  agendaEntries,
  estimatedTimeInSeconds,
  sessionStartDate,
}: ActiveSessionAgendaProps): ReactElement {
  const [counter, setCounter] = useState<number>(
    getSessionCurrentMinute(sessionStartDate)
  );
  const { t } = useTranslation("common");
  const agendaStatus = (startMinute: number, endMinute: number) => {
    if (counter < startMinute) return "";
    if (counter >= startMinute && counter < endMinute) {
      return ON_GOING;
    }
    return ENDED;
  };

  useEffect(() => {
    if (estimatedTimeInSeconds && counter < estimatedTimeInSeconds) {
      setTimeout(() => {
        // update counter time (nowTime - sessionStartTime)
        setCounter(getSessionCurrentMinute(sessionStartDate));
      }, 10000);
    }
  }, [counter, estimatedTimeInSeconds, sessionStartDate]);

  const AgendaEntry = ({
    startMinute,
    endMinute,
    name,
    idx,
  }: ActiveSessionAgendaEntryProps): ReactElement => {
    return (
      <>
        <Typography
          className={`agendaHeader ${agendaStatus(startMinute, endMinute)}`}
        >
          {idx + 1}. {name}
        </Typography>
        <Typography
          className={`agendaHeader ${agendaStatus(startMinute, endMinute)}`}
        >
          {startMinute} min
        </Typography>
      </>
    );
  };

  const renderAgendaEntry = (
    idx: number,
    agendaEntry: AgendaPoint
  ): ReactElement => {
    // if it is last agenda entry endMinute of agenda entry is the endMinute of whole session
    if (idx === agendaEntries.length - 1) {
      return (
        <AgendaEntry
          startMinute={agendaEntry.startMinute}
          endMinute={estimatedTimeInSeconds}
          name={agendaEntry.name}
          idx={idx}
        />
      );
    }
    return (
      <AgendaEntry
        startMinute={agendaEntry.startMinute}
        endMinute={agendaEntries[idx + 1].startMinute}
        name={agendaEntry.name}
        idx={idx}
      />
    );
  };

  return (
    <Paper elevation={2} className="ActiveSessionAgenda">
      <Typography className="header">
        <TurnedInNotIcon className="icon" />
        {t("components.PresenterSession.Agenda.header")}
      </Typography>
      {agendaEntries?.map((agendaEntry: AgendaPoint, idx: number) => (
        <div key={`${idx}-${agendaEntry.name}`} className="agendaEntry">
          {renderAgendaEntry(idx, agendaEntry)}
        </div>
      ))}
    </Paper>
  );
}
