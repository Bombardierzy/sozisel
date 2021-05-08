import "./SessionCustomization.scss";

import * as yup from "yup";

import {
  Button,
  FormControlLabel,
  InputLabel,
  Paper,
  Switch,
  TextField,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import React, { ReactElement } from "react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

const sessionDetailsSchema = yup.object().shape({
  sessionName: yup.string().required("inputErrors.fieldRequired"),
  scheduledDateTime: yup
    .date()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
});

interface SessionCustomizationDetails {
  sessionName: string;
  entryPassword: string | undefined;
  scheduledDateTime: Date;
}

export interface SessionCustomizationProps {
  onValidSubmit: (options: {
    sessionName: string;
    entryPassword?: string;
    scheduledDateTime: Date;
    useJitsi: boolean;
  }) => void;
}

export default function SessionCustomization({
  onValidSubmit,
}: SessionCustomizationProps): ReactElement {
  const [useJitsi, setUseJitsi] = useState<boolean>(true);
  const [authorization, setAuthorization] = useState<boolean>(false);
  const { t } = useTranslation("common");
  const { handleSubmit, errors, control } = useForm({
    resolver: yupResolver(sessionDetailsSchema),
  });

  const onSubmit = (sessionDetails: SessionCustomizationDetails) => {
    onValidSubmit({
      sessionName: sessionDetails.sessionName,
      scheduledDateTime: sessionDetails.scheduledDateTime,
      useJitsi: useJitsi,
      entryPassword: sessionDetails.entryPassword,
    });
  };

  return (
    <>
      <Paper className="container" elevation={2}>
        <form className="sessionDetails" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="sessionName"
            control={control}
            defaultValue={t("components.SessionDetails.defaultSessionName")}
            as={
              <TextField
                size="small"
                variant="outlined"
                className="sessionName"
                error={!!errors.sessionName}
                helperText={errors.sessionName && t(errors.sessionName.message)}
              />
            }
          />

          <div className="formElement">
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  defaultChecked={useJitsi}
                  onChange={(e) => setUseJitsi(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <InputLabel className="label">
                  {t("components.SessionDetails.useJitsiLabel")}
                </InputLabel>
              }
              className="label"
            />
          </div>
          <div className="formElement">
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  defaultChecked={authorization}
                  onChange={(e) => setAuthorization(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <InputLabel className="label">
                  {t("components.SessionDetails.authorization")}
                </InputLabel>
              }
              className="label"
            />
            {authorization && (
              <Controller
                name="entryPassword"
                control={control}
                defaultValue=""
                as={
                  <TextField
                    name="entryPassword"
                    variant="outlined"
                    size="small"
                    className="input"
                    placeholder={t(
                      "components.SessionDetails.sessionPasswordPlaceholder"
                    )}
                    type="password"
                  />
                }
              />
            )}
          </div>
          <div className="formElement">
            <InputLabel className="label">
              {t("components.SessionDetails.datetime")}
            </InputLabel>
            <Controller
              name="scheduledDateTime"
              control={control}
              defaultValue=""
              as={
                <TextField
                  name="scheduledDateTime"
                  variant="outlined"
                  size="small"
                  className="input"
                  type="datetime-local"
                  color="primary"
                  error={!!errors.scheduledDateTime}
                  helperText={
                    errors.scheduledDateTime &&
                    t(errors.scheduledDateTime.message)
                  }
                />
              }
            />
          </div>

          <Button color="primary" type="submit" variant="contained">
            {t("components.SessionDetails.submitSession")}
          </Button>
        </form>
      </Paper>
    </>
  );
}
