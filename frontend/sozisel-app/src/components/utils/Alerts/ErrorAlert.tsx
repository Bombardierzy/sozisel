import "./ErrorAlert.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ErrorAlert(): ReactElement {
  const { t } = useTranslation("common");

  return (
    <Alert className="ErrorAlert" variant="outlined" severity="error">
      {t("components.SessionDetails.fetchingErrorMessage")}
    </Alert>
  );
}
