import "./Quiz.scss";

import {
  Button,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Control, Controller, DeepMap, FieldError } from "react-hook-form";
import React, { ReactElement, useState } from "react";

import QuestionsList from "./QuestionsList/QuestionsList";
import { TemplateContext } from "../../../../contexts/Template/TemplateContext";
import { mapQuizQuestions } from "../../../../contexts/Quiz/quizReducer";
import { useContext } from "react";
import { useCreateQuizMutation } from "../../../../graphql";
import { useQuizContext } from "../../../../contexts/Quiz/QuizContext";
import { useTranslation } from "react-i18next";

interface QuizProps {
  errors: DeepMap<Record<string, any>, FieldError>;
  control: Control;
  handleSubmit: any;
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
}: QuizProps): ReactElement {
  const { id } = useContext(TemplateContext);
  const [createQuiz, { error }] = useCreateQuizMutation();
  const { t } = useTranslation("common");
  const [trackingMode, setTrackingMode] = useState<boolean>(false);
  const [questions] = useQuizContext();
  const onSubmit = async (data: QuizData) => {
   await createQuiz({
      variables: {
        input: {
          name: data.eventName,
          eventData: {
            durationTimeSec: data.durationTime,
            trackingMode,
            quizQuestions: mapQuizQuestions(questions.questions),
            targetPercentageOfParticipants: data.percentageOfParticipants,
          },
          sessionTemplateId: id,
          startMinute: data.startMinute,
        },
      },
    });

    console.log(error);
    console.log(data);
    console.log( mapQuizQuestions(questions.questions));
    console.log( trackingMode);
    console.log( id);
  };

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

        <Typography className="label">
          {t("components.TemplateCreation.Quiz.trackingMode")}
          <Switch
            defaultChecked={trackingMode}
            onChange={(e) => setTrackingMode(e.target.checked)}
            color="primary"
          />
        </Typography>

        <QuestionsList />
        {error && error.message}
        <Button
          color="primary"
          onClick={() => handleSubmit(onSubmit)()}
          variant="contained"
          className="submitButton"
        >
          {t("components.TemplateCreation.EventCreation.submitButtonLabel")}
        </Button>
      </div>
    </div>
  );
}
