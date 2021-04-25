import "./AgendaEntry.scss";

import { ListItem, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import DeleteIcon from "@material-ui/icons/Delete";

interface AgendaEntryProps {
  title: string;
  time: number;
  idx: number;
  onDelete: () => void;
}

export default function AgendaEntry({
  title,
  time,
  idx,
  onDelete,
}: AgendaEntryProps): ReactElement {
  return (
    <ListItem className="AgendaEntry">
      <Typography className="pointTitle">{`${idx + 1}. ${title}`}</Typography>
      <Typography className="pointTime">{`(${time} min)`}</Typography>
      <DeleteIcon onClick={() => onDelete()} className="deleteIcon" />
    </ListItem>
  );
}
