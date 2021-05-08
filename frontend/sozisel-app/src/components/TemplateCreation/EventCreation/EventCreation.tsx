import "./EventCreation.scss";

import * as yup from "yup";

import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import Quiz from "../Modules/Quiz/Quiz";
import { QuizContextProvider } from "../../../contexts/Quiz/QuizContext";
import { quizSchema } from "./Schemas";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

const createSchema = (moduleType: string): yup.AnyObjectSchema => {
  switch (moduleType) {
    case "Quiz":
      return quizSchema;
    default:
      return quizSchema;
  }
};

export default function EventCreation(): ReactElement {
  const { t } = useTranslation("common");
  const [moduleType, setModuleType] = useState<string>("Quiz");
  const { handleSubmit, errors, control } = useForm({
    resolver: yupResolver(createSchema(moduleType)),
  });

  return (
    <Paper className="EventCreation" elevation={2}>
      <form className={"creationForm"}>
        <div className="eventForm">
          <Controller
            name="eventName"
            control={control}
            defaultValue={t(
              "components.TemplateCreation.EventCreation.moduleName"
            )}
            as={
              <TextField
                name="eventName"
                variant="outlined"
                size="small"
                className="eventName"
                error={errors.eventName}
                helperText={errors.eventName && t(errors.eventName.message)}
              />
            }
          />

          <FormControl size="small" variant="filled" className="moduleType">
            <Select
              variant="outlined"
              value={moduleType}
              onChange={(e) => setModuleType(e.target.value as string)}
              inputProps={{
                id: "moduleType",
              }}
            >
              <MenuItem value="" disabled />
              <MenuItem value="Quiz">Quiz</MenuItem>
              <MenuItem value="Ankieta">Ankieta</MenuItem>
              <MenuItem value="Geogebra">Geogebra</MenuItem>
              <MenuItem value="Tablica">Tablica</MenuItem>
            </Select>

            <Typography className="label">
              {t("components.TemplateCreation.EventCreation.startTime")}
            </Typography>
            <Controller
              name="startMinute"
              control={control}
              defaultValue={""}
              as={
                <TextField
                  name="startMinute"
                  variant="outlined"
                  size="small"
                  className="input"
                  type="number"
                  error={!!errors.startMinute}
                  helperText={
                    errors.startMinute && t(errors.startMinute.message)
                  }
                />
              }
            />
          </FormControl>
        </div>
        {moduleType === "Quiz" && (
          <QuizContextProvider>
            <Quiz
              handleSubmit={handleSubmit}
              errors={errors}
              control={control}
            />
          </QuizContextProvider>
        )}
      </form>
    </Paper>
  );
}
