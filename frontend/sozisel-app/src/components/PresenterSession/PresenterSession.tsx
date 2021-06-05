import "./PresenterSession.scss";

import { CircularProgress, Grid, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";

import Agenda from "./Agenda/Agenda";
import { Alert } from "@material-ui/lab";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import { useParams } from "react-router";
import { useSessionDetailsQuery } from "../../graphql";
import { useTranslation } from "react-i18next";

export default function PresenterSession(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");

  const { data, loading, error } = useSessionDetailsQuery({
    variables: {
      id,
    },
  });

  if (loading) {
    return (
      <div className="PresenterSession">
        <MainNavbar />
        <CircularProgress className="progressIndicator" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="PresenterSession">
        <MainNavbar />
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.PresenterSession.fetchingError")}
        </Alert>
      </div>
    );
  }

  return (
    <div className="PresenterSession">
      <MainNavbar />
      <Grid container spacing={1} className="containerGrid">
        <Grid item xs={3} className="firstRowItem">
          {data && data.session && (
            <Agenda
              agendaEntries={data.session.sessionTemplate.agendaEntries}
              estimatedTimeInSeconds={
                data.session.sessionTemplate.estimatedTime
              }
              sessionStartDate={new Date(data.session.startTime)}
            />
          )}
        </Grid>
        <Grid item xs={6} className="firstRowItem">
          <Paper elevation={2}></Paper>
        </Grid>
        <Grid item xs={3} className="firstRowItem">
          <Paper elevation={2}></Paper>
        </Grid>
        <Grid item xs={12} className="secondRowItem">
          <Paper elevation={2}></Paper>
        </Grid>
      </Grid>
    </div>
  );
}
