import "./AnnotationsPanel.scss";

import { DeleteOutlined, Edit, Timer } from "@material-ui/icons";
import { IconButton, Paper, TextField, Tooltip } from "@material-ui/core";
import { ReactElement, useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

interface AnnotationRowProps {
  id?: string;
  timestamp?: number;
  label?: string;
  mode: "create" | "edit";
  onDelete?: (id: string) => void;
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

export interface Annotation {
  id: string;
  timestamp: number;
  label: string;
}

function AnnotationRow({
  mode,
  id,
  timestamp = 0,
  label = "",
  onCreate,
  onDelete,
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

  const handleCreate = () => {
    if (fieldTimestamp !== -1 && text) {
      onCreate?.(fieldTimestamp, text);
    }

    setText("");
    setFieldTimestamp(-1);
  };

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
            (fieldTimestamp === -1 ? (
              <Timer style={{ fontSize: 16 }} />
            ) : (
              fieldTextTimestamp
            ))}
        </div>
      </Tooltip>

      <TextField
        inputProps={{
          className: `labelText ${mode === "create" ? "labelAdd" : ""}`,
          readOnly: mode === "edit",
          maxLength: 100,
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
          <IconButton
            size="small"
            onClick={() => id && onDelete && onDelete(id)}
          >
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
          <IconButton size="small" onClick={handleCreate}>
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
  annotations: Annotation[];
  onAnnotationCreate: (timestamp: number, label: string) => void;
  onAnnotationDelete: (id: string) => void;
}
export function AnnotationsPanel({
  annotations,
  onAnnotationCreate,
  onAnnotationDelete,
  onSeek,
  currentPlayerTimestamp,
}: AnnotationsPanelProps): ReactElement {
  const sortedAnnotations = useMemo(() => {
    const sortedAnnotations = [...annotations];
    sortedAnnotations.sort((a, b) => a.timestamp - b.timestamp);
    return sortedAnnotations;
  }, [annotations]);

  return (
    <Paper
      className="AnnotationsPanel"
      classes={{ rounded: "AnnotationsPanelRounded" }}
      elevation={4}
    >
      <div className="existingAnnotations">
        {sortedAnnotations.map((annotation, idx) => (
          <AnnotationRow
            key={idx}
            {...annotation}
            mode="edit"
            onTimestampPress={onSeek}
            currentPlayerTimestamp={currentPlayerTimestamp}
            onDelete={onAnnotationDelete}
          />
        ))}
      </div>
      <AnnotationRow
        mode="create"
        timestamp={0}
        label=""
        currentPlayerTimestamp={currentPlayerTimestamp}
        onCreate={onAnnotationCreate}
      />
    </Paper>
  );
}
