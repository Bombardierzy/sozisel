import "./AgendaEntryCreation.scss";

import * as yup from "yup";

import { Button, InputLabel, TextField, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import React, { ReactElement } from "react";

import { AgendaPoint } from "../../../model/Agenda";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface AgendaEntryCreationProps {
  agenda?: AgendaPoint[];
  sessionDurationTime?: number;
  updateAgendaEntries: (agendaEntry: AgendaPoint[]) => void;
}

const agendaSchema = yup.object().shape({
  name: yup.string().required("inputErrors.fieldRequired"),
  startMinute: yup
    .number()
    .integer("inputErrors.fieldIntegerRequired")
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
});

export default function AgendaEntryCreation({
  agenda,
  sessionDurationTime,
  updateAgendaEntries,
}: AgendaEntryCreationProps): ReactElement {
  const { t } = useTranslation("common");
  const { handleSubmit, errors, control, setValue, setError } = useForm({
    resolver: yupResolver(agendaSchema),
  });

  const onSubmit = (agendaEntry: AgendaPoint) => {
    if (
      agenda &&
      agenda.filter(
        (element) => agendaEntry.startMinute === element.startMinute
      ).length > 0
    ) {
      setError("startMinute", {
        type: "manual",
        message: "inputErrors.agendaEntryExists",
      });
      return;
    }
    if (
      !!sessionDurationTime &&
      agendaEntry.startMinute >= sessionDurationTime
    ) {
      setError("startMinute", {
        type: "manual",
        message: "inputErrors.agendaIncorrectTime",
      });
      return;
    }
    setValue("name", "");
    setValue("startMinute", "");
    agenda && updateAgendaEntries([...agenda, agendaEntry]);
  };

  return (
    <div className="PointCreationContainer">
      <Typography className="header">
        {t("components.TemplateCreation.AgendaEntryCreation.header")}
      </Typography>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <InputLabel className="label">
          {t("components.TemplateCreation.AgendaEntryCreation.contextHeader")}
        </InputLabel>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          as={
            <TextField
              name="name"
              variant="outlined"
              size="small"
              className="input"
              error={!!errors.name}
              helperText={errors.name && t(errors.name.message)}
            />
          }
        />

        <InputLabel className="label">
          {t("components.TemplateCreation.AgendaEntryCreation.startTime")}
        </InputLabel>
        <Controller
          name="startMinute"
          control={control}
          defaultValue=""
          as={
            <TextField
              name="startMinute"
              variant="outlined"
              size="small"
              className="input"
              type="number"
              error={!!errors.startMinute}
              helperText={errors.startMinute && t(errors.startMinute.message)}
            />
          }
        />

        <Button color="primary" type="submit" variant="contained">
          {t(
            "components.TemplateCreation.AgendaEntryCreation.submitButtonLabel"
          )}
        </Button>
      </form>
    </div>
  );
}
