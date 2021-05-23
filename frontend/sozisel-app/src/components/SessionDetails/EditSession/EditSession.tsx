import "./EditSession.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ReactElement, useState } from "react";
import SessionDetails, {
  OnSessionSubmitProps,
} from "../SessionDetails/SessionDetails";
import {
  useSessionDetailsQuery,
  useUpdateSessionMutation,
} from "../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import CircularProgress from "@material-ui/core/CircularProgress";
import MainNavbar from "../../MainNavbar/MainNavbar";
import Snackbar from "@material-ui/core/Snackbar";
import TemplateOverview from "../TemplateOverview/TemplateOverview";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditSession(): ReactElement {
  const { t } = useTranslation("common");
  const { id } = useParams<{ id: string }>();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading } = useSessionDetailsQuery({
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
  });

  const [
    updateMutation,
    { error: updateError, loading: updateLoading },
  ] = useUpdateSessionMutation();

  const onSubmit = async ({
    sessionName,
    entryPassword,
    scheduledDateTime,
    useJitsi,
  }: OnSessionSubmitProps) => {
    try {
      await updateMutation({
        variables: {
          input: {
            id: id,
            entryPassword: entryPassword,
            name: sessionName,
            scheduledStartTime: scheduledDateTime,
            useJitsi: useJitsi,
          },
        },
      });
      setSuccessMessage(
        `${t("components.SessionDetails.updateSuccessMessage")}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div className="EditSession">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (data?.session) {
    return (
      <>
        <MainNavbar />
        <div className="EditSession">
          <SessionDetails
            onValidSubmit={onSubmit}
            currentName={data.session.name}
            currentPassword={data.session.entryPassword ?? undefined}
            currentUseJitsi={data.session.useJitsi}
            currentScheduledDateTime={data.session.scheduledStartTime}
          />
          <TemplateOverview template={data.session.sessionTemplate} />
          <Snackbar
            open={successMessage !== ""}
            autoHideDuration={AUTO_HIDE_DURATION}
            onClose={() => setSuccessMessage("")}
          >
            <Alert onClose={() => setSuccessMessage("")} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={updateLoading} autoHideDuration={AUTO_HIDE_DURATION}>
            <CircularProgress />
          </Snackbar>
          <Snackbar open={!!updateError} autoHideDuration={AUTO_HIDE_DURATION}>
            <Alert severity="error">
              {t("components.SessionDetails.updateErrorMessage")}
            </Alert>
          </Snackbar>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="EditSession">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.SessionDetails.fetchingErrorMessage")}
        </Alert>
      </div>
    </>
  );
}
