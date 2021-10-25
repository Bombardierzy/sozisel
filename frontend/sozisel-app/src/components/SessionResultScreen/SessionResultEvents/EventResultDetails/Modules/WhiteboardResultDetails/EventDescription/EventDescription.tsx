import "./EventDescription.scss";
import React, { ReactElement } from "react";
import CalendarToday from "@material-ui/icons/CalendarToday";
import LatextText from "../../../../../../utils/LatexText/LatextText";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface EventDescriptionProps {
  eventName: string;
  averageUsedTime: number;
  participantsNumber: number;
  task: string;
}

interface SectionProps {
  header: string;
  text?: string;
  children?: ReactElement;
}

const Section = ({ header, text, children }: SectionProps) => (
  <div className="Section">
    <p className="header">{header}</p>
    <p className="text">{text}</p>
    {children}
  </div>
);

const EventDescription = ({
  eventName,
  participantsNumber,
  averageUsedTime,
  task,
}: EventDescriptionProps): ReactElement => {
  const { t } = useTranslation("common");

  return (
    <div className="EventDescription">
      <div className="header">
        <CalendarToday className="icon" />
        <Typography className="headerText">{eventName}</Typography>
      </div>
      <Section
        header={t(
          "components.SessionEventResults.Whiteboard.participantsNumber"
        )}
        text={participantsNumber.toString()}
      />
      <Section
        header={t("components.SessionEventResults.Whiteboard.averageTimeLabel")}
        text={t("components.SessionEventResults.Whiteboard.averageTime", {
          value: averageUsedTime,
        })}
      />
      <Section
        header={t("components.SessionEventResults.Whiteboard.taskLabel")}
      >
        <div>
          <LatextText text={task} />
        </div>
      </Section>
    </div>
  );
};

export default EventDescription;
