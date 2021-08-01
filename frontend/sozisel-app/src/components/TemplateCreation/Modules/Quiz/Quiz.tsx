import "./Quiz.scss";

import {
  Button,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Control, Controller, DeepMap, FieldError } from "react-hook-form";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
} from "../../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../../common/consts";
import { Alert } from "@material-ui/lab";
import QuestionsList from "./QuestionsList/QuestionsList";
import { Quiz } from "../../../../model/Template";
import { TemplateContext } from "../../../../contexts/Template/TemplateContext";
import { useEventContext } from "../../../../contexts/Event/EventContext";
import { useQuizContext } from "../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";

interface QuizProps {
  /*eslint-disable */
  errors: DeepMap<Record<string, any>, FieldError>;
  handleSubmit: (cb: any) => () => void;
  /*eslint-enable */
  control: Control;
  setValue: (
    name: string,
    value: string | number,
    config?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
        }>
      | undefined
  ) => void;
}

interface QuizData {
  eventName: string;
  durationTime: number;
  startMinute: number;
  percentageOfParticipants: number;
}

export default function Quiz({
  errors,
  control,
  handleSubmit,
  setValue,
}: QuizProps): ReactElement {
  const { id } = useContext(TemplateContext);
  const [createQuiz, { error: createQuizError }] = useCreateQuizMutation({
    refetchQueries: ["SessionTemplate"],
  });
  const [message, setMessage] = useState<string>("");
  const [updateQuiz, { error: updateQuizError }] = useUpdateQuizMutation({
    refetchQueries: ["SessionTemplate"],
  });
  const [event, eventDispatch] = useEventContext();
  const { t } = useTranslation("common");
  const [{ questions, percentageOfParticipants, durationTime }, quizDispatch] =
    useQuizContext();

  const onReset = useCallback((): void => {
    setValue(
      "eventName",
      String(t("components.TemplateCreation.EventCreation.moduleName"))
    );
    setValue("durationTime", "");
    setValue("startMinute", "");
    setValue("percentageOfParticipants", "");
    quizDispatch({ type: "RESET" });
    eventDispatch({ type: "RESET" });
  }, [eventDispatch, quizDispatch, setValue, t]);

  useEffect(() => {
    const eventData = event.eventData as Quiz;
    if (event.id !== "") {
      quizDispatch({
        type: "SET_QUESTIONS",
        questions: eventData.quizQuestions,
      });
      quizDispatch({
        type: "SET_PERCENTAGE_OF_PARTICIPANTS",
        percentageOfParticipants: eventData.targetPercentageOfParticipants,
      });
      quizDispatch({
        type: "SET_DURATION_TIME",
        durationTime: eventData.durationTimeSec,
      });
    } else {
      onReset();
    }
  }, [quizDispatch, event.id, event.eventData, onReset]);

  useEffect(() => {
    percentageOfParticipants !== 0 &&
      setValue("percentageOfParticipants", percentageOfParticipants);
    durationTime !== 0 && setValue("durationTime", durationTime);
  }, [percentageOfParticipants, durationTime, setValue]);

  const onUpdate = useCallback(
    async (data: QuizData) => {
      await updateQuiz({
        variables: {
          input: {
            name: data.eventName,
            eventData: {
              durationTimeSec: data.durationTime,
              quizQuestions: questions,
              targetPercentageOfParticipants: data.percentageOfParticipants,
            },
            id: event.id,
            startMinute: data.startMinute,
          },
        },
      });
      updateQuizError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onEditEventMessage")
        );
      onReset();
    },
    [event.id, onReset, questions, t, updateQuiz, updateQuizError]
  );

  const onSubmit = useCallback(
    async (data: QuizData) => {
      await createQuiz({
        variables: {
          input: {
            name: data.eventName,
            eventData: {
              durationTimeSec: data.durationTime,
              quizQuestions: questions,
              targetPercentageOfParticipants: data.percentageOfParticipants,
            },
            sessionTemplateId: id,
            startMinute: data.startMinute,
          },
        },
      });
      createQuizError &&
        setMessage(
          t("components.TemplateCreation.EventCreation.onAddEventMessage")
        );
      onReset();
    },
    [createQuiz, createQuizError, id, onReset, questions, t]
  );

  return (
    <div className="Quiz">
      <div className="quizForm">
        <Typography className="label">
          {t("components.TemplateCreation.Quiz.durationTime")}
        </Typography>
        <Controller
          name="durationTime"
          control={control}
          defaultValue={""}
          as={
            <TextField
              variant="outlined"
              size="small"
              className="durationTime"
              error={!!errors.durationTime}
              helperText={errors.durationTime && t(errors.durationTime.message)}
            />
          }
        />

        <Typography className="label">
          {t("components.TemplateCreation.Quiz.percentageOfParticipants")}
        </Typography>
        <Controller
          name="percentageOfParticipants"
          control={control}
          defaultValue={""}
          as={
            <TextField
              name="percentageOfParticipants"
              variant="outlined"
              size="small"
              type="number"
              className="percentageOfParticipants"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              error={!!errors.percentageOfParticipants}
              helperText={
                errors.percentageOfParticipants &&
                t(errors.percentageOfParticipants.message)
              }
            />
          }
        />

        <QuestionsList />
        {(createQuizError || updateQuizError) && (
          <Typography className="error">
            {t("inputErrors.incorrectQuizQuestion")}
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
    </div>
  );
}
