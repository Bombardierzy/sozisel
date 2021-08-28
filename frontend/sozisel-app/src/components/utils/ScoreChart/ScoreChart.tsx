import "./ScoreChart.scss";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface BarChartProps {
  data: Data[];
}

interface Data {
  score: number;
  counter: number;
}

const ScoreChart = ({ data }: BarChartProps): ReactElement => {
  const { t } = useTranslation("common");
  return (
    <ResponsiveContainer width="70%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        className="ScoreChart"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="score"
          label={{
            value: t("components.ScoreChart.score"),
            position: "insideBottomRight",
            dx: -50,
            offset: 0,
          }}
        />
        <YAxis
          label={{
            value: t("components.ScoreChart.numberOfParticipants"),
            angle: -90,
            dx: -20,
          }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="counter" fill="#F2994A" legendType="none" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;