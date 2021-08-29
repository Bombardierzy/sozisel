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
  readonly?: boolean;
  playerDuration: number;
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
  readonly = false,
  id,
  timestamp = 0,
  label = "",
  playerDuration,
  onCreate,
  onDelete,
  onTimestampPress,
  currentPlayerTimestamp,
}: AnnotationRowProps): ReactElement {
  const { t } = useTranslation("common");
  const [text, setText] = useState<string>(label);

  const [fieldTimestamp, setFieldTimestamp] = useState<number>(-1);

  const disabled = useMemo(
    () => timestamp > playerDuration,
    [timestamp, playerDuration]
  );

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

  const tooltipTitle = useMemo(() => {
    if (mode === "create") {
      return t(
        "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.selectCurrentTimestampTip"
      ) as string;
    }

    if (timestamp > playerDuration) {
      return t(
        "components.SessionRecordingAnnotatedPlayer.AnnotationsPanel.timestampOverflow"
      ) as string;
    }

    return "";
  }, [mode, playerDuration, t, timestamp]);

  const handleCreate = () => {
    if (fieldTimestamp !== -1 && text) {
      onCreate?.(fieldTimestamp, text);
    }

    setText("");
    setFieldTimestamp(-1);
  };

  return (
    <div className="AnnotationRow">
      <Tooltip arrow placement="top" title={tooltipTitle}>
        <div
          className={`timestamp ${disabled ? "disabled" : ""}`}
          onClick={disabled ? undefined : onTimestampPressCb}
        >
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
      {!readonly && mode === "edit" && (
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
      {!readonly && mode === "create" && (
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
  duration: number;
  readonly?: boolean;
  onSeek: (timestamp: number) => void;
  currentPlayerTimestamp: () => number;
  annotations: Annotation[];
  onAnnotationCreate: (timestamp: number, label: string) => void;
  onAnnotationDelete: (id: string) => void;
}
export function AnnotationsPanel({
  duration,
  readonly = false,
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
            readonly={readonly}
            playerDuration={duration}
            key={idx}
            {...annotation}
            mode="edit"
            onTimestampPress={onSeek}
            currentPlayerTimestamp={currentPlayerTimestamp}
            onDelete={onAnnotationDelete}
          />
        ))}
      </div>
      {!readonly && (
        <AnnotationRow
          playerDuration={duration}
          mode="create"
          timestamp={0}
          label=""
          currentPlayerTimestamp={currentPlayerTimestamp}
          onCreate={onAnnotationCreate}
        />
      )}
    </Paper>
  );
}
