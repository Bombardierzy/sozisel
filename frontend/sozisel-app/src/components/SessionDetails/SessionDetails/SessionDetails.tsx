import "./SessionDetails.scss";

import * as yup from "yup";

import {
  Button,
  FormControlLabel,
  InputLabel,
  Switch,
  TextField,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ReactElement, useEffect } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { PresenterSessionFiles } from "../../Files/PresenterSessionFiles/PresenterSessionFiles";
import SoziselCard from "../../utils/Card/SoziselCard";
import pl from "date-fns/locale/pl";
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

interface SessionDetailsFormSchema {
  sessionName: string;
  entryPassword?: string;
  scheduledDateTime: Date;
}

export interface OnSessionSubmitProps {
  sessionName: string;
  entryPassword?: string;
  scheduledDateTime: Date;
  useJitsi: boolean;
}

export interface SessionDetailsProps {
  onValidSubmit: (props: OnSessionSubmitProps) => void;
  sessionId?: string;
  currentName?: string;
  currentPassword?: string;
  currentScheduledDateTime?: Date;
  currentUseJitsi?: boolean;
}

export default function SessionDetails({
  onValidSubmit,
  sessionId,
  currentName,
  currentPassword,
  currentScheduledDateTime,
  currentUseJitsi,
}: SessionDetailsProps): ReactElement {
  const [useJitsi, setUseJitsi] = useState<boolean>(
    currentUseJitsi === undefined ? true : currentUseJitsi
  );
  const [authorization, setAuthorization] = useState<boolean>(
    currentPassword !== undefined
  );
  const { t } = useTranslation("common");
  const { handleSubmit, errors, control, setValue, register } = useForm({
    resolver: yupResolver(sessionDetailsSchema),
  });

  const [scheduledDateTime, setScheduledDateTime] = useState<Date>(
    currentScheduledDateTime ?? new Date()
  );

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onSubmit = (sessionDetails: SessionDetailsFormSchema) => {
    onValidSubmit({
      sessionName: sessionDetails.sessionName,
      scheduledDateTime: sessionDetails.scheduledDateTime,
      useJitsi: useJitsi,
      entryPassword: authorization ? sessionDetails.entryPassword : "",
    });
  };

  useEffect(() => {
    register("scheduledDateTime");
  }, [register]);

  useEffect(() => {
    if (!currentScheduledDateTime) return;

    setScheduledDateTime(
      currentScheduledDateTime != null
        ? new Date(currentScheduledDateTime)
        : new Date()
    );
  }, [currentScheduledDateTime]);

  useEffect(() => {
    if (!scheduledDateTime) return;

    setValue("scheduledDateTime", scheduledDateTime, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [scheduledDateTime, setValue]);

  return (
    <>
      <div className="SessionDetails">
        <SoziselCard>
          <form
            className="sessionDetailsForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="sessionName"
              control={control}
              defaultValue={
                currentName ?? t("components.SessionDetails.defaultSessionName")
              }
              as={
                <TextField
                  size="small"
                  variant="outlined"
                  className="sessionName"
                  error={!!errors.sessionName}
                  helperText={
                    errors.sessionName && t(errors.sessionName.message)
                  }
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
                  defaultValue={currentPassword ?? ""}
                  as={
                    <TextField
                      name="entryPassword"
                      variant="outlined"
                      size="small"
                      className="input"
                      placeholder={t(
                        "components.SessionDetails.sessionPasswordPlaceholder"
                      )}
                      type="text"
                    />
                  }
                />
              )}
            </div>
            <div className="formElement">
              <InputLabel className="label">
                {t("components.SessionDetails.datetime")}
              </InputLabel>

              <MuiPickersUtilsProvider locale={pl} utils={DateFnsUtils}>
                <DateTimePicker
                  inputVariant="outlined"
                  disablePast
                  ampm={false}
                  variant="inline"
                  value={scheduledDateTime}
                  format="d MMM yyyy HH:mm"
                  onChange={(date) => {
                    setScheduledDateTime(date as Date);
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            {/* files can be added only to already created session */}
            {sessionId && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => setDialogOpen(true)}
              >
                {t("components.SessionDetails.sessionFiles")}
              </Button>
            )}

            <Button color="primary" type="submit" variant="contained">
              {t("components.SessionDetails.submitSession")}
            </Button>
          </form>
        </SoziselCard>
      </div>
      {sessionId && (
        <PresenterSessionFiles
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          sessionId={sessionId}
        />
      )}
    </>
  );
}
