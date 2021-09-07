import "./StatsRow.scss";

import React from "react";

export interface StatsRowProps {
  label: string;
  value: string;
}

export default function StatsRow({
  label,
  value,
}: StatsRowProps): React.ReactElement {
  return (
    <div className="StatsRow">
      <div className="statsRowLabel">{label}</div>
      <div className="statsRowValue">{value}</div>
    </div>
  );
}
