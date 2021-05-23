import "./CreateSession.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { ReactElement, useState } from "react";
import SessionDetails, {
  OnSessionSubmitProps,
} from "./SessionDetails/SessionDetails";
import {
  useCreateSessionMutation,
  useSessionTemplateQuery,
} from "../../graphql";

import { AUTO_HIDE_DURATION } from "../../common/consts";
import CircularProgress from "@material-ui/core/CircularProgress";
import MainNavbar from "../MainNavbar/MainNavbar";
import Snackbar from "@material-ui/core/Snackbar";
import TemplateOverview from "./TemplateOverview/TemplateOverview";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface CreateSessionProps {
  templateId: string;
}

export default function CreateSession(): ReactElement {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading } = useSessionTemplateQuery({
    fetchPolicy: "network-only",
    variables: {
      id: (location.state as CreateSessionProps).templateId,
    },
  });
  const [
    createMutation,
    { error: createError, loading: createLoading },
  ] = useCreateSessionMutation();

  const onSubmit = async ({
    sessionName,
    entryPassword,
    scheduledDateTime,
    useJitsi,
  }: OnSessionSubmitProps) => {
    try {
      await createMutation({
        variables: {
          input: {
            entryPassword: entryPassword,
            name: sessionName,
            scheduledStartTime: scheduledDateTime,
            sessionTemplateId: (location.state as CreateSessionProps)
              .templateId,
            useJitsi: useJitsi,
          },
        },
      });
      setSuccessMessage(`${t("components.SessionDetails.successMessage")}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div className="CreateSession">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (data?.sessionTemplate) {
    return (
      <>
        <MainNavbar />
        <div className="CreateSession">
          <SessionDetails onValidSubmit={onSubmit} />
          <TemplateOverview template={data.sessionTemplate} />
          <Snackbar
            open={successMessage !== ""}
            autoHideDuration={AUTO_HIDE_DURATION}
            onClose={() => setSuccessMessage("")}
          >
            <Alert onClose={() => setSuccessMessage("")} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={createLoading} autoHideDuration={AUTO_HIDE_DURATION}>
            <CircularProgress />
          </Snackbar>
          <Snackbar open={!!createError} autoHideDuration={AUTO_HIDE_DURATION}>
            <Alert severity="error">
              {t("components.SessionDetails.errorMessage")}
            </Alert>
          </Snackbar>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="CreateSession">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.SessionDetails.fetchingErrorMessage")}
        </Alert>
      </div>
    </>
  );
}
