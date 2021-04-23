import "./AgendaPoint.scss";

import { ListItem, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import DeleteIcon from "@material-ui/icons/Delete";

interface AgendaPointProps {
  title: string;
  time: number;
  idx: number;
  onDelete: () => void;
}

export default function AgendaPoint({
  title,
  time,
  idx,
  onDelete,
}: AgendaPointProps): ReactElement {
  return (
    <ListItem className="AgendaPoint">
      <Typography className="pointTitle">{`${idx + 1}. ${title}`}</Typography>
      <Typography className="pointTime">{`(${time} min)`}</Typography>
      <DeleteIcon onClick={() => onDelete()} className="deleteIcon" />
    </ListItem>
  );
}
