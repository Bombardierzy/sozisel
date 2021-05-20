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
import React, { ReactElement, useCallback } from "react";
import {
  useSessionTemplateQuery,
  useUpdateSessionTemplateInputMutation,
} from "../../graphql";

import Agenda from "./Agenda/Agenda";
import AgendaEntryCreation from "./AgendaEntryCreation/AgendaEntryCreation";
import { AgendaPoint } from "../../model/Agenda";
import CircularProgress from "@material-ui/core/CircularProgress";
import { EventContextProvider } from "../../contexts/Event/EventContext";
import EventCreation from "./EventCreation/EventCreation";
import EventList from "./EventsList/EventList";
import { Grid } from "@material-ui/core";
import MainNavbar from "../MainNavbar/MainNavbar";
import TemplateContextProvider from "../../contexts/Template/TemplateContext";
import { useEffect } from "react";
import { useLocation } from "react-router";
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
  const location = useLocation<{ id: string }>();
  const { data, loading } = useSessionTemplateQuery({
    variables: { id: location.state.id },
  });
  const template = data?.sessionTemplate;
  const [agenda, setAgenda] = useState<AgendaPoint[]>([]);
  const [durationTime, setDurationTime] = useState<number>(90);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [
    updateSessionTemplateInputMutation,
    { loading: updateLoading, error },
  ] = useUpdateSessionTemplateInputMutation({
    refetchQueries: ["SessionTemplate"],
  });

  useEffect(() => {
    setAgenda(
      template?.agendaEntries?.map((element) => ({
        name: element.name,
        startMinute: element.startMinute,
      })) || []
    );
    setDurationTime(template?.estimatedTime || 90);
    setIsPublic(template?.isPublic || false);
  }, [template?.agendaEntries, template?.estimatedTime, template?.isPublic]);

  const updateAgendaEntries = useCallback(
    (agendaEntries: AgendaPoint[]) => {
      updateSessionTemplateInputMutation({
        variables: {
          input: {
            id: location.state.id,
            isPublic: template?.isPublic,
            estimatedTime: template?.estimatedTime,
            agendaEntries,
            name: template?.name,
          },
        },
      });
    },
    [
      location.state.id,
      template?.estimatedTime,
      template?.isPublic,
      template?.name,
      updateSessionTemplateInputMutation,
    ]
  );

  const onUpdate = useCallback(
    (sessionDetails: SessionDetails) => {
      updateSessionTemplateInputMutation({
        variables: {
          input: {
            id: location.state.id,
            isPublic,
            estimatedTime: sessionDetails.durationTime,
            agendaEntries: agenda,
            name: sessionDetails.templateName,
          },
        },
      });
    },
    [updateSessionTemplateInputMutation, location.state.id, isPublic, agenda]
  );

  const { t } = useTranslation("common");
  const { handleSubmit, errors, control, setValue } = useForm({
    resolver: yupResolver(templateDetailsSchema),
  });

  return (
    <>
      {loading ? (
        <Grid
          container
          justify="center"
          alignContent="center"
          className="progressBar"
        >
          <CircularProgress size={200} />
        </Grid>
      ) : (
        <TemplateContextProvider id={location.state.id}>
          <>
            <MainNavbar />
            <div className="TemplateCreation">
              <Paper className="container" elevation={2}>
                <form
                  className="templateDetails"
                  onSubmit={handleSubmit(onUpdate)}
                >
                  <Controller
                    name="templateName"
                    control={control}
                    defaultValue={template?.name}
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
                        checked={isPublic}
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
                      defaultValue={durationTime}
                      control={control}
                      render={() => (
                        <TextField
                          name="durationTime"
                          variant="outlined"
                          value={durationTime}
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
                    {!updateLoading && error && error.message}
                  </span>
                  <Button color="primary" type="submit" variant="contained">
                    {t("components.TemplateCreation.createTemplateButtonText")}
                  </Button>
                </form>
                <Agenda
                  agenda={agenda}
                  updateAgendaEntries={updateAgendaEntries}
                />
                <AgendaEntryCreation
                  updateAgendaEntries={updateAgendaEntries}
                  agenda={agenda}
                  sessionDurationTime={durationTime}
                />
              </Paper>
              <EventContextProvider>
                <EventList events={template?.events} />
                <EventCreation />
              </EventContextProvider>
            </div>
          </>
        </TemplateContextProvider>
      )}
    </>
  );
}
