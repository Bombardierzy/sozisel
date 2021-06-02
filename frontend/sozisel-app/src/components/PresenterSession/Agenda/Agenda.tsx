import "./Agenda.scss";

import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";

import { AgendaPoint } from "../../../model/Agenda";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";

interface AgendaProps {
  agendaEntries: AgendaPoint[];
  estimatedTime: number;
}

interface AgendaEntryProps {
  startMinute: number;
  endMinute: number;
  name: string;
  idx: number;
}

export default function Agenda({
  agendaEntries,
  estimatedTime,
}: AgendaProps): ReactElement {
  const [counter, setCounter] = useState<number>(0);
  const agendaStatus = (startMinute: number, endMinute: number) => {
    if (counter < startMinute) return "";
    if (
      (counter >= startMinute && counter < endMinute) ||
      startMinute === endMinute
    )
      return "during";
    return "finished";
  };

  useEffect(() => {
    if (estimatedTime && counter < estimatedTime) {
      setTimeout(() => {
        setCounter(counter + 1);
      }, 60000);
    }
  }, [counter, estimatedTime]);

  const AgendaEntry = ({
    startMinute,
    endMinute,
    name,
    idx,
  }: AgendaEntryProps): ReactElement => {
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
          {endMinute} min
        </Typography>
      </>
    );
  };

  return (
    <Paper elevation={2} className="Agenda">
      <Typography className="header">
        <TurnedInNotIcon className="icon" />
        Agenda
      </Typography>
      {agendaEntries?.map((agendaEntry: AgendaPoint, idx: number) => (
        <div key={`${idx}-${agendaEntry.name}`} className="agendaEntry">
          {(() => {
            if (idx === 0) {
              return (
                <AgendaEntry
                  startMinute={0}
                  endMinute={agendaEntry.startMinute}
                  name={agendaEntry.name}
                  idx={idx}
                />
              );
            } else if (
              idx === agendaEntries.length - 1 &&
              counter >= agendaEntry.startMinute
            ) {
              return (
                <AgendaEntry
                  startMinute={agendaEntry.startMinute}
                  endMinute={agendaEntry.startMinute}
                  name={agendaEntry.name}
                  idx={idx}
                />
              );
            } else {
              return (
                <AgendaEntry
                  startMinute={agendaEntries[idx - 1].startMinute}
                  endMinute={agendaEntry.startMinute}
                  name={agendaEntry.name}
                  idx={idx}
                />
              );
            }
          })()}
        </div>
      ))}
    </Paper>
  );
}
