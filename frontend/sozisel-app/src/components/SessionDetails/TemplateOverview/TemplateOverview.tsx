import "./TemplateOverview.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Paper,
  Typography,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OverviewListElement from "../OverviewListElement/OverviewListElement";
import { ReactElement } from "react";
import { SessionTemplate } from "../../../model/Template";
import ShadowBoxCard from "../../utils/Card/ShadowBoxCard";
import { useTranslation } from "react-i18next";

export interface TemplateOverviewProps {
  template: SessionTemplate;
}

export default function TemplateOverview({
  template,
}: TemplateOverviewProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <div className="TemplateOverviewContainer">
      <ShadowBoxCard>
        <Paper className="templateOverview" elevation={2}>
          <Typography
            variant="button"
            gutterBottom
            color="primary"
            className="templateName"
          >
            {template.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {t("components.SessionDetails.durationTime")}:{" "}
            {template.estimatedTime} {t("components.SessionDetails.minutes")}
          </Typography>
          <Accordion className="accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography
                variant="button"
                gutterBottom
                color="primary"
                className="accordionSummary"
              >
                {t("components.SessionDetails.agenda")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className="overviewList">
                {template.agendaEntries.map((element, index) => (
                  <OverviewListElement
                    key={index}
                    name={element.name}
                    index={index + 1}
                    trailingText={`(${element.startMinute.toString()} min)`}
                  />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion className="accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography
                variant="button"
                gutterBottom
                color="primary"
                className="accordionSummary"
              >
                {t("components.SessionDetails.events")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className="overviewList">
                {template.events.map((element, index) => (
                  <OverviewListElement
                    key={element.id}
                    name={element.name}
                    index={index + 1}
                    trailingText={`(${element.startMinute.toString()} min)`}
                  />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </ShadowBoxCard>
    </div>
  );
}
