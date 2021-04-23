import "./TemplateCreation.scss";

import { List, Paper, Typography } from "@material-ui/core";

import AgendaPoint from "./AgendaPoint/AgendaPoint";
import AgendaPointCreation from "./AgendaPointCreation/AgendaPointCreation";
import MainNavbar from "../MainNavbar/MainNavbar";
import { ReactElement } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const agendaInitial = [
  { title: "Bongloud gambit", time: 30 },
  { title: "Gambit Parisa", time: 10 },
  { title: "Essa gambit krolowy", time: 15 },
];

export default function TemplateCreation(): ReactElement {
  const [agenda, setAgenda] = useState(agendaInitial);
  const { t } = useTranslation("common");

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="TemplateContainer">
        <Paper className="agenda" elevation={2}>
          <Typography variant="h6" component="h6">
            {t("components.TemplateCreation.header")}
          </Typography>
          <List component="ol">
            {agenda.map((element, idx) => (
              <AgendaPoint
                key={idx}
                title={element.title}
                time={element.time}
                idx={idx}
                onDelete={() =>
                  setAgenda(agenda.filter((ele) => ele !== element))
                }
              />
            ))}
          </List>
          <AgendaPointCreation setAgenda={setAgenda} agenda={agenda} />
        </Paper>
      </div>
    </>
  );
}
