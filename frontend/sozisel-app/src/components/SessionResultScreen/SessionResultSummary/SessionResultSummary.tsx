import "./SessionResultSummary.scss";

import {
  AUTO_HIDE_DURATION,
  SHORT_LOCAL_DATE_FORMAT,
} from "../../../common/consts";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { ReactElement, useMemo } from "react";
import {
  useSessionBasicInfoQuery,
  useSessionSummaryQuery,
} from "../../../graphql";

import { Alert } from "@material-ui/lab";
import SoziselCard from "../../utils/Card/SoziselCard";
import SummaryDetails from "./SummaryDetails";
import TotalAreaChart from "./TotalAreaChart";
import { useTranslation } from "react-i18next";

interface SessionResultSummaryProps {
  sessionId: string;
}

export default function SessionResultSummary({
  sessionId,
}: SessionResultSummaryProps): ReactElement {
  const { t } = useTranslation("common");

  const { data: sessionData } = useSessionBasicInfoQuery({
    variables: { id: sessionId },
  });
  const { data } = useSessionSummaryQuery({ variables: { id: sessionId } });

  const chartData = useMemo(() => {
    if (data?.sessionSummary?.eventParticipations) {
      return data.sessionSummary.eventParticipations.map(
        ({ eventName, submissions }) => ({
          xLabel: eventName,
          value: submissions,
        })
      );
    }
    return [];
  }, [data?.sessionSummary?.eventParticipations]);

  if (data?.sessionSummary) {
    return (
      <div className="SessionResultSummary">
        <SoziselCard>
          <div className="cardContent">
            <SummaryDetails
              date={new Date(
                sessionData?.session?.startTime || ""
              ).toLocaleString([], SHORT_LOCAL_DATE_FORMAT)}
              durationTime={data.sessionSummary.durationTime}
              participants={data.sessionSummary.totalParticipants}
              interactions={data.sessionSummary.totalSubmissions}
            />

            <div className="totalParticipants">
              <div className="totalParticipantsHeader">
                <h2>
                  {t("components.SessionResultSummary.participantsChart.title")}
                </h2>
                <h3>
                  {t(
                    "components.SessionResultSummary.participantsChart.subtitle"
                  )}
                </h3>
              </div>
              <div className="chart">
                {/* TODO add some placeholder if there were no activated events*/}
                <TotalAreaChart
                  data={chartData}
                  valueLabel={t(
                    "components.SessionResultSummary.participantsChart.valueLabel"
                  )}
                />
              </div>
            </div>
          </div>
        </SoziselCard>
      </div>
    );
  }

  return (
    <>
      <CircularProgress />;
      <Snackbar open autoHideDuration={AUTO_HIDE_DURATION}>
        <Alert severity="error">{t("errors.request")}</Alert>
      </Snackbar>
    </>
  );
}
