import "./SessionResultSummary.scss";

import { ReactElement, useMemo } from "react";

import { Paper } from "@material-ui/core";
import SummaryDetails from "./SummaryDetails";
import TotalAreaChart from "./TotalAreaChart";
import { useTranslation } from "react-i18next";

interface SessionResultSummaryProps {
  sessionId: string;
}

export default function SessionResultSummary(
  _: SessionResultSummaryProps
): ReactElement {
  const { t } = useTranslation("common");

  const chartData = useMemo(() => {
    const events = [];

    const eventsCount = Math.floor(Math.random() * 15) + 1;

    for (let i = 0; i < eventsCount; i++) {
      const participants = Math.floor(Math.random() * 100) + 1;

      events.push({ xLabel: `Event ${i + 1}`, value: participants });
    }

    return events;
  }, []);

  return (
    <div className="SessionResultSummary">
      <Paper className="paper" elevation={3}>
        {/* TODO: change me to some valid data when query is ready*/}
        <SummaryDetails
          date={"20.06.2021"}
          durationTime={120}
          participants={15}
          interactions={200}
        />

        <div className="totalParticipants">
          <div className="totalParticipantsHeader">
            <h2>
              {t("components.SessionResultSummary.participantsChart.title")}
            </h2>
            <h3>
              {t("components.SessionResultSummary.participantsChart.subtitle")}
            </h3>
          </div>
          <div className="chart">
            <TotalAreaChart
              data={chartData}
              valueLabel={t(
                "components.SessionResultSummary.participantsChart.valueLabel"
              )}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
}
