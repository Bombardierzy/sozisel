import './ScoreChart.scss';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import React, { ReactElement } from "react";


interface BarChartProps {
  data: Data[]
}

interface Data {
  score: number,
  counter: number,
}

const ScoreChart = ({data}: BarChartProps): ReactElement => {
  return (
    <BarChart
      width={1000}
      height={250}
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
      <XAxis dataKey="score"/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="counter" fill="#F2994A" name="Ilość punktów"/>
    </BarChart>
  );
};

export default ScoreChart;
