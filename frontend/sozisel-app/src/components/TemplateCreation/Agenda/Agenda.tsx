import "./Agenda.scss";

import { List, Typography } from "@material-ui/core";

import AgendaEntry from "../AgendaEntry/AgendaEntry";
import { AgendaPoint } from "../../../model/Agenda";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface AgendaProps {
  setAgenda: (state: AgendaPoint[]) => void;
  agenda: AgendaPoint[];
}

export default function Agenda({
  agenda,
  setAgenda,
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
          .map((element, idx) => (
            <AgendaEntry
              key={idx}
              title={element.name}
              time={element.startMinute}
              idx={idx}
              onDelete={() =>
                setAgenda(agenda.filter((ele) => ele !== element))
              }
            />
          ))}
      </List>
    </div>
  );
}
