import "./JoinSession.scss";

import * as yup from "yup";

import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useSessionThumbnailQuery } from "../../graphql";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const joinSessionSchema = yup.object().shape({
  userName: yup.string().required("inputErrors.fieldRequired"),
});

export interface JoinSessionFormSchema {
  userName: string;
  password: string;
}

export default function JoinSession(): ReactElement {
  const { t } = useTranslation("common");
  const { id } = useParams<{ id: string }>();
  const { handleSubmit, errors, control } = useForm({
    resolver: yupResolver(joinSessionSchema),
  });

  const onSubmit = (schema: JoinSessionFormSchema) => {
    console.log(schema);
  };

  const { data, loading } = useSessionThumbnailQuery({
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  if (loading) {
    return (
      <>
        <BasicNavbar />
        <div className="JoinSession">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (data?.sessionThumbnail) {
    return (
      <>
        <BasicNavbar />
        <div className="JoinSession">
          <Typography variant="h4" className="header">
            {data.sessionThumbnail.name}
          </Typography>
          <Typography variant="h6" className="header">
            {data.sessionThumbnail.owner.firstName}{" "}
            {data.sessionThumbnail.owner.lastName}
          </Typography>
          <Typography variant="subtitle1">
            {new Date(
              data.sessionThumbnail.scheduledStartTime
            ).toLocaleString()}
          </Typography>
          <form className="joinSessionForm" onSubmit={handleSubmit(onSubmit)}>
            <Typography className="label">
              {t("components.JoinSession.name")}
            </Typography>
            <Controller
              name="userName"
              control={control}
              defaultValue={""}
              as={
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  className="userName"
                  error={!!errors.userName}
                  helperText={errors.userName && t(errors.userName.message)}
                />
              }
            />
            {data.sessionThumbnail.passwordRequired && (
              <div>
                <Typography className="label">
                  {" "}
                  {t("components.JoinSession.password")}
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  defaultValue={""}
                  as={
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="password"
                      className="password"
                    />
                  }
                />
              </div>
            )}

            <Button
              color="primary"
              type="submit"
              variant="contained"
              className="submitButton"
            >
              {t("components.JoinSession.join")}
            </Button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <BasicNavbar />
      <div className="EditSession">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.JoinSession.errorMessage")}
        </Alert>
      </div>
    </>
  );
}
