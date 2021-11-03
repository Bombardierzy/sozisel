import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ReactElement } from "react";

export type TotalAreaChartData = {
  xLabel: string;
  value: number;
}[];

export interface TotalAreaChartProps {
  data: TotalAreaChartData;
  valueLabel: string;
}

export default function TotalAreaChart({
  data,
  valueLabel,
}: TotalAreaChartProps): ReactElement {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, left: 0, right: 0, bottom: 0 }}>
        <XAxis dataKey="xLabel" tick={false} />
        <YAxis dataKey="value" />
        <Tooltip
          formatter={(value: number, _name: string, _props: unknown) => [
            value,
            valueLabel,
          ]}
        />
        <Bar
          dataKey="value"
          stroke="#F2994A"
          fillOpacity={0.5}
          fill="#FF8A65"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
