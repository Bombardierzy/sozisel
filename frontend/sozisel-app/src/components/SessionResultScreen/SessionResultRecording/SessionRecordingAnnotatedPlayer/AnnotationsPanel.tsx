import "./AnnotationsPanel.scss";

import { DeleteOutlined, Edit, Timer } from "@material-ui/icons";
import { IconButton, Paper, TextField, Tooltip } from "@material-ui/core";
import { ReactElement, useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

interface AnnotationRowProps {
  timestamp?: number;
  label?: string;
  mode: "create" | "edit";
  onDelete?: () => void;
  onCreate?: (time: number, label: string) => void;
  onTimestampPress?: (timestamp: number) => void;
  currentPlayerTimestamp: () => number;
}

function formatTimestamp(timestamp: number) {
  const seconds = Math.floor(timestamp % 60);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const hours = Math.floor(timestamp / 3600);

  const hoursStr = hours > 0 ? `${hours}:` : "";
  const minutesStr = hoursStr && minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return hoursStr + minutesStr + secondsStr;
}

function AnnotationRow({
  mode,
  timestamp = 0,
  label = "",
  onTimestampPress,
  currentPlayerTimestamp,
}: AnnotationRowProps): ReactElement {
  const { t } = useTranslation("common");
  const [text, setText] = useState<string>(label);

  const [fieldTimestamp, setFieldTimestamp] = useState<number>(-1);

  const textTimestamp = useMemo(() => {
    return formatTimestamp(timestamp);
  }, [timestamp]);

  const fieldTextTimestamp = useMemo(() => {
    return formatTimestamp(fieldTimestamp);
  }, [fieldTimestamp]);

  const onTimestampPressCb = useCallback(() => {
    if (mode === "create") {
      setFieldTimestamp(currentPlayerTimestamp());
    } else {
      onTimestampPress?.(timestamp);
    }
  }, [currentPlayerTimestamp, mode, onTimestampPress, timestamp]);

  return (
    <div className="AnnotationRow">
      <Tooltip
        arrow
        placement="top"
        title={
          mode === "create"
            ? (t(
                "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.selectCurrentTimestampTip"
              ) as string)
            : ""
        }
      >
        <div className="timestamp" onClick={onTimestampPressCb}>
          {mode === "edit" && textTimestamp}
          {mode == "create" &&
            (fieldTimestamp === -1 ? <Timer /> : fieldTextTimestamp)}
        </div>
      </Tooltip>

      <TextField
        inputProps={{
          className: `labelText ${mode === "create" ? "labelAdd" : ""}`,
          readOnly: mode === "edit",
        }}
        placeholder={
          t(
            "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.addPlaceholder"
          ) as string
        }
        size="small"
        variant="outlined"
        className="label"
        value={text}
        required
        onChange={(event) => setText(event.target.value)}
      />
      {mode === "edit" && (
        <Tooltip
          arrow
          placement="top"
          title={
            t(
              "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.delete"
            ) as string
          }
        >
          <IconButton size="small">
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      )}
      {mode === "create" && (
        <Tooltip
          arrow
          placement="top"
          title={
            t(
              "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.add"
            ) as string
          }
        >
          <IconButton size="small">
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

interface AnnotationsPanelProps {
  onSeek: (timestamp: number) => void;
  currentPlayerTimestamp: () => number;
}
export function AnnotationsPanel({
  onSeek,
  currentPlayerTimestamp,
}: AnnotationsPanelProps): ReactElement {
  const rows = [
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 30, label: "Wydarzenie roku, ankieta" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
    { timestamp: 120, label: "Racja musi być po mojej stronie" },
    { timestamp: 250, label: "Kolejna aferka" },
  ];
  return (
    <Paper
      className="AnnotationsPanel"
      classes={{ rounded: "AnnotationsPanelRounded" }}
      elevation={4}
    >
      <div className="existingAnnotations">
        {rows.map((row, idx) => (
          <AnnotationRow
            key={idx}
            {...row}
            mode="edit"
            onTimestampPress={onSeek}
            currentPlayerTimestamp={currentPlayerTimestamp}
          />
        ))}
      </div>
      <AnnotationRow
        mode="create"
        timestamp={0}
        label=""
        currentPlayerTimestamp={currentPlayerTimestamp}
      />
    </Paper>
  );
}
