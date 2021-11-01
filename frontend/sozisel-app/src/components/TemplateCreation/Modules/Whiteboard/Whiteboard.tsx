import "./Whiteboard.scss";
import {
  Button,
  Snackbar,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Whiteboard,
  useCreateWhiteboardMutation,
  useUpdateWhiteboardMutation,
} from "../../../../graphql";
import { AUTO_HIDE_DURATION } from "../../../../common/consts";
import { Alert } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import { EventModuleProps } from "../EventModuleProps";
import { EventProperties } from "../../EventCreation/EventProperties";
import { InfoOutlined } from "@material-ui/icons";
import LatextText from "../../../utils/LatexText/LatextText";
import { TemplateContext } from "../../../../contexts/Template/TemplateContext";
import { useEventContext } from "../../../../contexts/Event/EventContext";
import useGetErrorMessage from "../../../../hooks/useGetErrorMessage";
import { useTranslation } from "react-i18next";

interface WhiteboardData extends EventProperties {
  task: string;
}

export default function Whiteboard({
  errors,
  control,
  handleSubmit,
  setValue,
}: EventModuleProps): ReactElement {
  const [text, setText] = useState<string>("");
  const [showMarkdown, setShowMarkdown] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { t } = useTranslation("common");
  const { id } = useContext(TemplateContext);
  const [event, eventDispatch] = useEventContext();
  const getErrorMessage = useGetErrorMessage();
  const [createWhiteboard, { error: createWhiteboardError }] =
    useCreateWhiteboardMutation({ refetchQueries: ["SessionTemplate"] });
  const [updateWhiteboard, { error: updateWhitboardError }] =
    useUpdateWhiteboardMutation();

  const onReset = useCallback((): void => {
    setValue("eventName", "");
    setValue("durationTime", "");
    setValue("startMinute", "");
    setValue("task", "");
    setText("");
    eventDispatch({ type: "RESET" });
  }, [eventDispatch, setValue]);

  const onUpdate = useCallback(
    async (data: WhiteboardData) => {
      await updateWhiteboard({
        variables: {
          input: {
            id: event.id,
            startMinute: data.startMinute,
            name: data.eventName,
            durationTimeSec: data.durationTime,
            eventData: {
              task: data.task,
            },
          },
        },
      });
      !updateWhitboardError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onEditEventMessage")
        );
      onReset();
    },
    [event.id, onReset, t, updateWhitboardError, updateWhiteboard]
  );

  const onSubmit = useCallback(
    async (data: WhiteboardData) => {
      await createWhiteboard({
        variables: {
          input: {
            sessionTemplateId: id,
            name: data.eventName,
            startMinute: data.startMinute,
            durationTimeSec: data.durationTime,
            eventData: {
              task: data.task,
            },
          },
        },
      });
      !createWhiteboardError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onAddEventMessage")
        );
      onReset();
    },
    [createWhiteboard, createWhiteboardError, id, onReset, t]
  );

  useEffect(() => {
    const eventData = event.eventData as Whiteboard;
    if (event.id !== "") {
      setText(eventData.task);
      setValue("task", eventData.task);
    }
  }, [event.id, event.eventData, onReset, setValue]);

  useEffect(() => {
    setValue("task", text);
  }, [setValue, text, showMarkdown]);

  return (
    <div className="whiteboard">
      <Typography className="taskTitle">
        {t("components.TemplateCreation.Whiteboard.taskTitle")}
        <Tooltip
          title={
            t("components.TemplateCreation.Whiteboard.taskExplanation") || ""
          }
        >
          <InfoOutlined fontSize="small" className="infoIcon" />
        </Tooltip>
        <Button
          color="primary"
          variant="contained"
          className="previewButton"
          onClick={() => setShowMarkdown((prev) => !prev)}
        >
          {t("components.TemplateCreation.Whiteboard.previewButton")}
        </Button>
      </Typography>

      {showMarkdown ? (
        <LatextText text={text} />
      ) : (
        <Controller
          name="task"
          control={control}
          render={(props) => (
            <TextareaAutosize
              {...props}
              rowsMin={10}
              aria-label="minimum height"
              placeholder={t(
                "components.TemplateCreation.Whiteboard.taskPlaceholder"
              )}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className={`taskText ${errors.task && "errorBorder"}`}
            />
          )}
        />
      )}
      {errors.task && t(errors.task.message) && (
        <Typography className="error">{t(errors.task.message)}</Typography>
      )}
      {updateWhitboardError && (
        <Typography className="error">
          {getErrorMessage(updateWhitboardError)}
        </Typography>
      )}
      {event.id ? (
        <Button
          color="primary"
          onClick={() => handleSubmit(onUpdate)()}
          variant="contained"
          className="updateButton"
        >
          {t("components.TemplateCreation.EventCreation.updateButtonLabel")}
        </Button>
      ) : (
        <Button
          color="primary"
          onClick={() => handleSubmit(onSubmit)()}
          variant="contained"
          className="submitButton"
        >
          {t("components.TemplateCreation.EventCreation.submitButtonLabel")}
        </Button>
      )}
      <Snackbar
        open={message !== ""}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={() => setMessage("")}
      >
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
