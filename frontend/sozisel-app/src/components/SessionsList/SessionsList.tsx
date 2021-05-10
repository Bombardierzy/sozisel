import "./SessionsList.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ReactElement, useCallback, useState } from "react";
import { SessionStatus, useSearchSessionsQuery } from "../../graphql";

import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import MainNavbar from "../MainNavbar/MainNavbar";
import SessionCard from "./SessionCard/SessionCard";
import SessionFilters from "./SessionFilters/SessionFilters";
import Snackbar from "@material-ui/core/Snackbar";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SessionsList(): ReactElement {
  const { t } = useTranslation("common");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading, refetch } = useSearchSessionsQuery({
    variables: { input: { status: SessionStatus.Any } },
  });

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="SessionsListContainer">
          <SessionFilters />
          <CircularProgress></CircularProgress>
        </div>
      </>
    );
  }

  if (data?.searchSessions) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="SessionsListContainer">
          <SessionFilters />
          <div className="listWithSearchBar">
            <List>
              {data.searchSessions.map((element, _) => (
                <SessionCard key={element.id} session={element} />
              ))}
            </List>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="SessionsListContainer">
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.SessionsList.fetchingErrorMessage")}
        </Alert>
      </div>
    </>
  );
}
