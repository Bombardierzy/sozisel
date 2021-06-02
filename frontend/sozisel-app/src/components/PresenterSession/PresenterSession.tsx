import "./PresenterSession.scss";

import { Grid, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";

import Agenda from "./Agenda/Agenda";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import { useParams } from "react-router";
import { useSessionDetailsQuery } from "../../graphql";

export default function PresenterSession(): ReactElement {
  const { id } = useParams<{ id: string }>();

  const { data, loading } = useSessionDetailsQuery({
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });
  if (loading) {
    return <> </>;
  }
  return (
    <div className="PresenterSession">
      <MainNavbar></MainNavbar>
      <Grid container spacing={1} className="containerGrid">
        <Grid item xs={3} className="firstRowItem">
          {data && data.session && (
            <Agenda
              agendaEntries={data.session.sessionTemplate.agendaEntries}
              estimatedTime={data.session.sessionTemplate.estimatedTime}
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
