import "./EditSession.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { ReactElement, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import MainNavbar from "../../MainNavbar/MainNavbar";
import SessionCustomization from "../SessionCustomization/SessionCustomization";
import Snackbar from "@material-ui/core/Snackbar";
import TemplateOverview from "../TemplateOverview/TemplateOverview";
import { useLocation } from "react-router-dom";
import { useSessionDetailsQuery } from "../../../graphql";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface SessionEditProps {
  sessionId: string;
}

export default function EditSession(): ReactElement {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading, error } = useSessionDetailsQuery({
    fetchPolicy: "network-only",
    variables: {
      id: (location.state as SessionEditProps).sessionId,
    },
  });
  // TODO add update mutation
  //   const [
  //     createMutation,
  //     { error: createError, loading: createLoading },
  //   ] = useCreateSessionMutation();

  const onSubmit = async ({
    sessionName,
    entryPassword,
    scheduledDateTime,
    useJitsi,
  }: {
    sessionName: string;
    entryPassword?: string;
    scheduledDateTime: Date;
    useJitsi: boolean;
  }) => {
    // try {
    //   await createMutation({
    //     variables: {
    //       input: {
    //         entryPassword: entryPassword,
    //         name: sessionName,
    //         scheduledStartTime: scheduledDateTime,
    //         sessionTemplateId: (location.state as SessionCreationProps)
    //           .templateId,
    //         useJitsi: useJitsi,
    //       },
    //     },
    //   });
    //   setSuccessMessage(`${t("components.SessionDetails.successMessage")}`);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="SessionCreation">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (data?.session) {
    return (
      <>
        <MainNavbar />
        <div className="SessionCreation">
          <SessionCustomization
            onValidSubmit={onSubmit}
            currentName={data.session.name}
            currentPassword={data.session.entryPassword ?? undefined}
            currentScheduledDateTime={data.session.scheduledStartTime}
          />
          <TemplateOverview
            template={data.session.sessionTemplate}
          ></TemplateOverview>
          <Snackbar
            open={successMessage !== ""}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage("")}
          >
            <Alert onClose={() => setSuccessMessage("")} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
          {/* <Snackbar open={createLoading} autoHideDuration={3000}>
            <CircularProgress />
          </Snackbar>
          <Snackbar open={!!createError} autoHideDuration={6000}>
            <Alert severity="error">
              {t("components.SessionDetails.errorMessage")}
            </Alert>
          </Snackbar> */}
        </div>
      </>
    );
  }

  console.log(error);

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="SessionCreation">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.SessionDetails.fetchingErrorMsg")}
        </Alert>
      </div>
    </>
  );
}
