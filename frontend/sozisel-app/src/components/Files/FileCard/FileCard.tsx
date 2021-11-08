import "./FileCard.scss";

import {
  FormControlLabel,
  InputLabel,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { UrlType, getTypedUrl } from "../../utils/Urls/urls";

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

  return (
    <div className="FileCard">
      <div className="fileCardContent">
        <div className="cardHeader">
          <IconButton
            href={getTypedUrl({ type: UrlType.sessionResource, id: path })}
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
    </div>
  );
}
