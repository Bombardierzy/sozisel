import "./FileCard.scss";

import {
  Card,
  FormControlLabel,
  InputLabel,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { BaseSyntheticEvent, ReactElement, useState } from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import { useTranslation } from "react-i18next";

export interface FileCardProps {
  key: string;
  filename: string;
  fileId: string;
  path: string;
  isPublic?: boolean;
  onDelete?: (fileId: string) => void;
  onAccessChange?: (isPublic: boolean, fileId: string) => void;
}

export default function FileCard({
  filename,
  fileId,
  isPublic,
  onDelete,
  path,
  onAccessChange,
}: FileCardProps): ReactElement {
  const { t } = useTranslation("common");
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
            <IconButton
              href={`${window.location.protocol}//${window.location.hostname}:4000/session_resource/${path}`}
              target="_blank"
            >
              <GetAppIcon />
            </IconButton>
            <Typography component="h5" variant="h5">
              {filename}
            </Typography>
          </div>
          <div className="actionsButton">
            {onAccessChange && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={isPublic}
                    onChange={() => onAccessChange(!isPublic, fileId)}
                    color="primary"
                  />
                }
                label={
                  <InputLabel className="label">
                    {t("components.Files.public")}
                  </InputLabel>
                }
                className="label"
              />
            )}
            {onDelete && (
              <IconButton onClick={() => onDelete(fileId)}>
                <DeleteIcon className="deleteIcon" />
              </IconButton>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
