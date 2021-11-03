import "./Poll.scss";

import {
  Button,
  Checkbox,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Poll,
  useCreatePollMutation,
  useUpdatePollMutation,
} from "../../../../../graphql";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AUTO_HIDE_DURATION } from "../../../../../common/consts";
import { Alert } from "@material-ui/lab";

import ClearIcon from "@material-ui/icons/Clear";
import { Controller } from "react-hook-form";
import { EventModuleProps } from "../EventModuleProps";
import { EventProperties } from "../../EventProperties";
import { TemplateContext } from "../../../../../contexts/Template/TemplateContext";
import omitDeep from "omit-deep-lodash";
import { useEventContext } from "../../../../../contexts/Event/EventContext";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

interface PollOption {
  id: string;
  text: string;
}

interface PollData extends EventProperties {
  question: string;
  options: PollOption[];
  isMultiChoice: boolean;
}

const defaultOption = () => ({ id: uuid(), text: "" });

const validateOptions = (options: PollOption[]) =>
  options.filter((option) => option.text !== "").length >= 2;

export function Poll({
  errors,
  control,
  handleSubmit,
  setValue,
}: EventModuleProps): ReactElement {
  const { id } = useContext(TemplateContext);
  const [createPoll, { error: createPollError }] = useCreatePollMutation({
    refetchQueries: ["SessionTemplate"],
  });

  const [message, setMessage] = useState<string>("");

  const [options, setOptions] = useState<PollOption[]>([defaultOption()]);

  const [updatePoll, { error: updatePollError }] = useUpdatePollMutation();
  const [event, eventDispatch] = useEventContext();

  const [isOptionsError, setOptionsError] = useState<boolean>(false);

  const { t } = useTranslation("common");

  const onReset = useCallback((): void => {
    setValue("eventName", "");
    setValue("durationTime", "");
    setValue("startMinute", "");
    setValue("question", "");
    setValue("isMultiChoice", false);
    setOptions([]);

    eventDispatch({ type: "RESET" });
    setOptionsError(false);
  }, [eventDispatch, setValue, setOptionsError]);

  useEffect(() => {
    const eventData = event.eventData as Poll;

    if (event.id !== "") {
      setValue("isMultiChoice", eventData.isMultiChoice);
      setValue("question", eventData.question);
      setOptions(omitDeep(eventData.options, "__typename") as PollOption[]);
    }
  }, [event.id, event.eventData, setOptions, onReset, setValue]);

  useEffect(() => {
    if (options.length === 0) {
      setOptions([defaultOption()]);
    }
  }, [options, setOptions]);

  const updateOption = (id: string, text: string) =>
    setOptions((options) =>
      options.map((option) => (option.id === id ? { id, text } : option))
    );

  const onUpdate = useCallback(
    async (data: PollData) => {
      if (!validateOptions(options)) {
        setOptionsError(true);
        return;
      }

      await updatePoll({
        variables: {
          input: {
            id: event.id,
            startMinute: data.startMinute,
            name: data.eventName,
            durationTimeSec: data.durationTime,
            eventData: {
              question: data.question,
              isMultiChoice: data.isMultiChoice,
              options: options,
            },
          },
        },
      });
      !updatePollError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onEditEventMessage")
        );
      onReset();
    },
    [event.id, onReset, options, t, updatePoll, updatePollError]
  );

  const onSubmit = useCallback(
    async (data: PollData) => {
      if (!validateOptions(options)) {
        setOptionsError(true);
        return;
      }

      await createPoll({
        variables: {
          input: {
            sessionTemplateId: id,
            name: data.eventName,
            startMinute: data.startMinute,
            durationTimeSec: data.durationTime,
            eventData: {
              question: data.question,
              isMultiChoice: data.isMultiChoice,
              options: options,
            },
          },
        },
      });
      !createPollError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onAddEventMessage")
        );
      onReset();
    },
    [createPoll, createPollError, id, onReset, options, t]
  );

  return (
    <div className="Poll">
      <div>
        <Typography className="label">
          {t("components.TemplateCreation.Poll.question")}
        </Typography>
        <Controller
          name="question"
          control={control}
          defaultValue={""}
          as={
            <TextField
              variant="outlined"
              size="small"
              className="input"
              placeholder={t(
                "components.TemplateCreation.Poll.defaultQuestion"
              )}
              error={errors.question}
              helperText={errors.question && t(errors.question.message)}
              // helperText={errors.eventName && t(errors.eventName.message)}
            />
          }
        />
        <div className="multichoice">
          <Typography className="label">
            {t("components.TemplateCreation.Poll.isMultiChoice")}:
          </Typography>
          <Controller
            name="isMultiChoice"
            defaultValue={false}
            control={control}
            // as={<Checkbox color="primary" size="small" />}
            render={(props) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        <Typography className="label options">
          {t("components.TemplateCreation.Poll.options")}
        </Typography>

        {options.map((option) => (
          <TextField
            key={option.id}
            size="small"
            variant="outlined"
            className="input pollOption"
            placeholder={t(
              "components.TemplateCreation.Poll.defaultOptionText"
            )}
            value={option.text}
            onChange={(e) => updateOption(option.id, e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <ClearIcon
                    color="primary"
                    className="clearOption"
                    onClick={() =>
                      setOptions((options) =>
                        options.filter((op) => op.id !== option.id)
                      )
                    }
                  />
                </InputAdornment>
              ),
            }}
          />
        ))}

        {/* TODO: add another error information in case of GraphqlError  */}

        <Button
          color="primary"
          variant="contained"
          className="newOption"
          onClick={() => setOptions((options) => [...options, defaultOption()])}
        >
          {t("components.TemplateCreation.Poll.addOption")}
        </Button>

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
        {isOptionsError && (
          <Typography className="error">
            {t("inputErrors.incorrectPoll")}
          </Typography>
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
    </div>
  );
}
