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
        data={data.map(({ score, counter }) => ({
          score: score.toString(),
          counter,
        }))}
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
          interval={0}
          dataKey="score"
          label={{
            value: t("components.ScoreChart.score"),
            position: "center",
            dy: 10,
          }}
        />
        <YAxis
          label={{
            value: t("components.ScoreChart.numberOfParticipants"),
            postion: "center",
            angle: -90,
            dx: -20,
          }}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="counter"
          fill="#F2994A"
          name={t("components.ScoreChart.numberOfParticipants")}
          legendType="none"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;
