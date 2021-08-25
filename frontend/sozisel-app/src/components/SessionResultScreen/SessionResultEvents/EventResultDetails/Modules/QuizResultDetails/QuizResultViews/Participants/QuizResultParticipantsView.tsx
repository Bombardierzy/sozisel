import "./QuizResultParticipantsView.scss";

import EnhancedTable from "../../../../../../../utils/Table/Table";
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { Typography } from "@material-ui/core";

export default function QuizResultParticipantsView(): React.ReactElement {
  const participants: { name: string; age: number }[] = [
    { name: "test", age: 20 },
    { name: "seba", age: 22 },
    { name: "seba", age: 22 },
    { name: "seba", age: 22 },
    { name: "seba", age: 22 },
    { name: "seba", age: 22 },
  ];

  return (
    <div className="QuizResultParticipantsView">
      <div className="headerWithIcon">
        <PeopleIcon color="primary" fontSize="large" />
        <Typography variant="h3" className="header">
          Uczestnicy
        </Typography>
      </div>
      <EnhancedTable
        data={participants}
        headCells={[
          { id: "name", label: "name" },
          { id: "age", label: "age" },
        ]}
        onClick={(a) => console.log(a)}
      />
    </div>
  );
}
