import "./TemplateCreation.scss";

import * as yup from "yup";

import {
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import React, { ReactElement } from "react";

import Agenda from "./Agenda/Agenda";
import AgendaEntryCreation from "./AgendaEntryCreation/AgendaEntryCreation";
import { AgendaPoint } from "../../model/Agenda";
import EventCreation from "./EventCreation/EventCreation";
import MainNavbar from "../MainNavbar/MainNavbar";
import ModuleList from "./EventsList/EventList";
import { useCreateSessionTemplateMutation } from "../../graphql";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface SessionDetails {
  templateName: string;
  durationTime: number;
}

const templateDetailsSchema = yup.object().shape({
  templateName: yup.string().required("inputErrors.fieldRequired"),
  durationTime: yup
    .number()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
});

export default function TemplateCreation(): ReactElement {
  const [agenda, setAgenda] = useState<AgendaPoint[]>([]);
  const [durationTime, setDurationTime] = useState<number>();
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [
    createSessionTemplateMutation,
    { error },
  ] = useCreateSessionTemplateMutation();

  const onSubmit = (sessionDetails: SessionDetails) => {
    createSessionTemplateMutation({
      variables: {
        input: {
          isPublic,
          estimatedTime: sessionDetails.durationTime,
          agendaEntries: agenda,
          name: sessionDetails.templateName,
        },
      },
    });
  };

  const { t } = useTranslation("common");
  const { handleSubmit, errors, control, setValue } = useForm({
    resolver: yupResolver(templateDetailsSchema),
  });
  return (
    <>
      <MainNavbar />
      <div className="TemplateCreation">
        <Paper className="container" elevation={2}>
          <form className="templateDetails" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="templateName"
              control={control}
              defaultValue={t(
                "components.TemplateCreation.defaultTemplateName"
              )}
              as={
                <TextField
                  size="small"
                  variant="outlined"
                  className="templateName"
                  error={!!errors.templateName}
                  helperText={
                    errors.templateName && t(errors.templateName.message)
                  }
                />
              }
            />

            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  defaultChecked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  {t("components.TemplateCreation.isPublicLabel")}
                </Typography>
              }
              className="label"
            />

            <div className="durationTime">
              <Typography
                variant="body2"
                className={`durationTimeLabel ${
                  errors.durationTime && "error"
                }`}
              >
                {t("components.TemplateCreation.timeDurationLabel")}
              </Typography>

              <Controller
                name="durationTime"
                control={control}
                defaultValue=""
                render={() => (
                  <TextField
                    name="durationTime"
                    variant="outlined"
                    size="small"
                    className="durationTimeInput"
                    type="number"
                    error={!!errors.durationTime}
                    onChange={(e) => {
                      setDurationTime(parseInt(e.target.value));
                      setValue("durationTime", parseInt(e.target.value));
                    }}
                  />
                )}
              />
            </div>
            <span className="error">
              {errors.durationTime && t(errors.durationTime.message)}
              {error}
            </span>
            <Button color="primary" type="submit" variant="contained">
              {t("components.TemplateCreation.createTemplateButtonText")}
            </Button>
          </form>
          <Agenda agenda={agenda} setAgenda={setAgenda} />
          <AgendaEntryCreation
            setAgenda={setAgenda}
            agenda={agenda}
            sessionDurationTime={durationTime}
          />
        </Paper>
        <ModuleList />
        <EventCreation />
      </div>
    </>
  );
}
