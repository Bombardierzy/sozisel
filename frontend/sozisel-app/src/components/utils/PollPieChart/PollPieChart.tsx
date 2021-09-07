import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import React, { ReactElement } from "react";
import { PollOptionSummary } from "../../../graphql";

interface PollPieChartProps {
  data: Pick<PollOptionSummary, "votes" | "text">[];
}

export default function PollPieChart({
  data,
}: PollPieChartProps): ReactElement {
  return (
    <ResponsiveContainer width="70%" height={250}>
      <PieChart>
        <Pie
          dataKey="votes"
          isAnimationActive={false}
          data={data}
          outerRadius={90}
          fill="#F2994A"
          label={(entry) => entry.text}
        />
        <Tooltip
          formatter={(value: string, name: number) => [value, data[name].text]}
        />
        {/* {
        data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]}/>
        ))
      }
      </Pie> */}
      </PieChart>
    </ResponsiveContainer>
  );
}
