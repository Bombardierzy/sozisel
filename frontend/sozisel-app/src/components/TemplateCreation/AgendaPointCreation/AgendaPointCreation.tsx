import "./AgendaPointCreation.scss";

import * as yup from "yup";

import { Button, InputLabel, TextField, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import React, { ReactElement } from "react";

import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

interface AgendaPointCreationProps {
  setAgenda: (state: any) => void;
  agenda: any;
}

const agendaSchema = yup.object().shape({
  title: yup.string().required("inputErrors.fieldRequired"),
  time: yup
    .number()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
});

export default function AgendaPointCreation({
  setAgenda,
  agenda,
}: AgendaPointCreationProps): ReactElement {
  const { t } = useTranslation("common");
  const { handleSubmit, errors, control, setValue, register } = useForm({
    resolver: yupResolver(agendaSchema),
  });

  const onSubmit = (data: any) => {
    setAgenda([...agenda, data]);
    setValue("title", "");
    setValue("time", "");
  };

  return (
    <div className="PointCreationContainer">
      <Typography className="header">{"Dodaj nowy punkt"}</Typography>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <InputLabel className="label">{"Treść"}</InputLabel>
        <Controller
          name="title"
          control={control}
          as={
            <TextField
              name="title"
              variant="outlined"
              ref={register}
              size="small"
              className="input"
              error={!!errors.title}
              helperText={errors.title && t(errors.title.message)}
            />
          }
        />

        <InputLabel className="label">{"Czas (w minutach)"}</InputLabel>
        <Controller
          name="time"
          control={control}
          as={
            <TextField
              name="time"
              variant="outlined"
              ref={register}
              size="small"
              className="input"
              type="number"
              error={!!errors.time}
              helperText={errors.time && t(errors.time.message)}
            />
          }
          onChange={() => console.log(errors.time)}
        />

        <Button type="submit" variant="contained">
          Dodaj
        </Button>
      </form>
    </div>
  );
}
