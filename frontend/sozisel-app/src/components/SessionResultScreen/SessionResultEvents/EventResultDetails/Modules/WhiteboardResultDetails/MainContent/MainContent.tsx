import "./MainContent.scss";
import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { People } from "@material-ui/icons";

const MainContent = (): ReactElement => {
  return (
    <Paper className="MainContent">
      <div className="header">
        <People className="icon" />
        <Typography className="headerText">{"Rozwiązanie"}</Typography>
      </div>
    </Paper>
  );
};

export default MainContent;
