import "./FileCard.scss";

import { Card, Typography } from "@material-ui/core";
import React, { BaseSyntheticEvent, ReactElement, useState } from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";

export interface FileCardProps {
  key: string;
  filename: string;
  onDelete: () => void;
  onDownload: () => void;
}

export default function FileCard({
  filename,
  onDelete,
  onDownload,
}: FileCardProps): ReactElement {
  const [raised, setRaised] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  return (
    <>
      <Card
        raised={raised}
        className="FileCard"
        onMouseOver={onMouseOverChange}
        onMouseOut={onMouseOverChange}
      >
        <div className="fileCardContent">
          <div className="cardHeader">
            <IconButton onClick={onDownload}>
              <GetAppIcon />
            </IconButton>
            <Typography component="h5" variant="h5">
              {filename}
            </Typography>
          </div>
          <IconButton onClick={onDelete}>
            <DeleteIcon className="deleteIcon" />
          </IconButton>
        </div>
      </Card>
    </>
  );
}
