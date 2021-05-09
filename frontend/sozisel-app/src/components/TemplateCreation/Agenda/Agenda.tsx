import "./Agenda.scss";

import { List, Typography } from "@material-ui/core";

import AgendaEntry from "../AgendaEntry/AgendaEntry";
import { AgendaPoint } from "../../../model/Agenda";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface AgendaProps {
  updateAgendaEntries: (state: AgendaPoint[]) => void;
  agenda: AgendaPoint[];
}

export default function Agenda({
  agenda,
  updateAgendaEntries,
}: AgendaProps): ReactElement {
  const { t } = useTranslation("common");
  return (
    <div className={"Agenda"}>
      <Typography variant="h6" component="h6">
        {t("components.TemplateCreation.Agenda.header")}
      </Typography>
      <List component="ol">
        {agenda
          .sort((a, b) => (a.startMinute <= b.startMinute ? -1 : 1))
          .map((agendaEntry, idx) => (
            <AgendaEntry
              key={idx}
              title={agendaEntry.name}
              startMinute={agendaEntry.startMinute}
              idx={idx}
              onDelete={() =>
                agenda &&
                updateAgendaEntries(
                  agenda.filter(
                    (element) => agendaEntry.startMinute !== element.startMinute
                  )
                )
              }
            />
          ))}
      </List>
    </div>
  );
}
