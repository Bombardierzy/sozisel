import "./SessionResultSummary.scss";

import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface SummaryDetailsProps {
  date: string;
  durationTime: number;
  participants: number;
  interactions: number;
}

export default function SummaryDetails({
  date,
  durationTime,
  participants,
  interactions,
}: SummaryDetailsProps): ReactElement {
  const { t } = useTranslation("common");

  const lines = [
    { title: t("components.SummaryDetails.date"), value: date },
    {
      title: t("components.SummaryDetails.durationTime"),
      value: `${durationTime} min`,
    },
    {
      title: t("components.SummaryDetails.numberOfParticipants"),
      value: participants,
    },
    {
      title: t("components.SummaryDetails.numberOfInteractions"),
      value: interactions,
    },
  ];

  return (
    <div className="SummaryDetails">
      {lines.map(({ title, value }) => (
        <div key="title" className="item">
          <div className="title">{title}</div>
          <div className="value">{value}</div>
        </div>
      ))}
    </div>
  );
}
