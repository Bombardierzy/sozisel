import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import React, { ReactElement } from "react";

import { PollOptionSummary } from "../../../graphql";

interface PollPieChartProps {
  data: Pick<PollOptionSummary, "votes" | "text">[];
  outerRadius?: number;
}

export default function PollPieChart({
  data,
  outerRadius = 90,
}: PollPieChartProps): ReactElement {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="votes"
          isAnimationActive={false}
          data={data}
          outerRadius={outerRadius}
          fill="#F2994A"
          label={(entry) => entry.text}
        />
        <Tooltip
          formatter={(value: string, name: number) => [value, data[name].text]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
