import "./JoinSession.scss";

import * as yup from "yup";

import { Button, TextField, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

const joinSessionSchema = yup.object().shape({
  userName: yup.string().required("inputErrors.fieldRequired"),
});

export interface JoinSessionFormSchema {
  userName: string;
  password: string;
}

export default function JoinSession(): ReactElement {
  const { t } = useTranslation("common");
  const { handleSubmit, errors, control } = useForm({
    resolver: yupResolver(joinSessionSchema),
  });

  const onSubmit = (schema: JoinSessionFormSchema) => {
    console.log(schema);
  };

  return (
    <>
      <BasicNavbar />
      <div className="JoinSession">
        <Typography variant="h4" className="header">
          Sieci Komputerowe
        </Typography>
        <Typography variant="h5" className="header">
          Jan Kowalski
        </Typography>
        <Typography variant="h6">01/21/2021</Typography>
        <form className="joinSessionForm" onSubmit={handleSubmit(onSubmit)}>
          <Typography className="label">Imię i nazwisko</Typography>
          <Controller
            name="userName"
            control={control}
            defaultValue={""}
            as={
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                className="userName"
                error={!!errors.userName}
                helperText={errors.userName && t(errors.userName.message)}
              />
            }
          />
          <Typography className="label">Hasło</Typography>
          <Controller
            name="password"
            control={control}
            defaultValue={""}
            as={
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                type="password"
                className="password"
              />
            }
          />
          <Button
            color="primary"
            type="submit"
            variant="contained"
            className="submitButton"
          >
            Dołącz
          </Button>
        </form>
      </div>
    </>
  );
}
