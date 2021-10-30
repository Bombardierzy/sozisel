import "./EventCreation.scss";

import * as yup from "yup";

import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { pollSchema, quizSchema, whiteboardSchema } from "./Schemas";

import { ArrowBackIos } from "@material-ui/icons";
import { Poll } from "../Modules/Poll/Poll";
import Quiz from "../Modules/Quiz/Quiz";
import { QuizContextProvider } from "../../../contexts/Quiz/QuizContext";
import ShadowBoxCard from "../../utils/Card/ShadowBoxCard";
import Whiteboard from "../Modules/Whiteboard/Whiteboard";
import { useEventContext } from "../../../contexts/Event/EventContext";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

const createSchema = (moduleType: string): yup.AnyObjectSchema => {
  switch (moduleType) {
    case "Quiz":
      return quizSchema;
    case "Poll":
      return pollSchema;
    case "Whiteboard":
      return whiteboardSchema;
    default:
      throw Error(`Encountered unknown module type: ${moduleType}`);
  }
};

export default function EventCreation(): ReactElement {
  const { t } = useTranslation("common");
  const [moduleType, setModuleType] = useState<string>("Quiz");
  const [{ id, name, startMinute, durationTimeSec, eventData }, dispatchEvent] =
    useEventContext();
  const { handleSubmit, errors, control, setValue, reset } = useForm({
    resolver: yupResolver(createSchema(moduleType)),
  });

  useEffect(() => {
    if (id) {
      if (eventData && eventData.__typename) {
        setModuleType(eventData.__typename);
      }
      setValue("eventName", name);
      setValue("startMinute", startMinute);
      setValue("durationTime", durationTimeSec);
    }
  }, [
    id,
    eventData,
    name,
    setValue,
    setModuleType,
    startMinute,
    durationTimeSec,
    reset,
  ]);

  const selectReset = (moduleType: string) => {
    setModuleType(moduleType);

    setValue("eventName", "");
    setValue("startMinute", "");
    setValue("durationTime", "");

    dispatchEvent({ type: "RESET" });
  };

  return (
    <div className="EventCreation">
      <ShadowBoxCard>
        <>
          {id && (
            <div className="iconContainer">
              <ArrowBackIos
                onClick={() => selectReset(moduleType)}
                className="icon"
              />
            </div>
          )}
          <form className="creationForm">
            <div>
              <Controller
                name="eventName"
                control={control}
                defaultValue=""
                placeholder={t(
                  "components.TemplateCreation.EventCreation.moduleName"
                )}
                as={
                  <TextField
                    autoComplete="no"
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
                  onChange={(e) => selectReset(e.target.value as string)}
                  inputProps={{
                    id: "moduleType",
                  }}
                >
                  <MenuItem value="" disabled />
                  <MenuItem value="Quiz">Quiz</MenuItem>
                  <MenuItem value="Poll">Ankieta</MenuItem>
                  <MenuItem value="Whiteboard">Tablica</MenuItem>
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
                <Typography className="label">
                  {t("components.TemplateCreation.EventCreation.durationTime")}
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
                      helperText={
                        errors.durationTime && t(errors.durationTime.message)
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
                  setValue={setValue}
                />
              </QuizContextProvider>
            )}
            {moduleType === "Poll" && (
              <Poll
                handleSubmit={handleSubmit}
                errors={errors}
                control={control}
                setValue={setValue}
              />
            )}
            {moduleType === "Whiteboard" && (
              <Whiteboard
                handleSubmit={handleSubmit}
                errors={errors}
                control={control}
                setValue={setValue}
              />
            )}
          </form>
        </>
      </ShadowBoxCard>
    </div>
  );
}
