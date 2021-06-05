import "./JoinSession.scss";

import * as yup from "yup";

import {
  Button,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ReactElement, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  useJoinSessionMutation,
  useSessionThumbnailQuery,
} from "../../graphql";

import BasicNavbar from "../Navbar/BasicNavbar/BasicNavbar";
import InfoIcon from "@material-ui/icons/Info";
import { LOCAL_DATE_FORMAT } from "../../common/consts";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const joinSessionSchema = yup.object().shape({
  userName: yup.string().required("inputErrors.fieldRequired"),
  email: yup
    .string()
    .required("inputErrors.fieldRequired")
    .email("inputErrors.invalidEmailFormat"),
});

export interface JoinSessionFormSchema {
  userName: string;
  email: string;
  password: string;
}

export default function JoinSession(): ReactElement {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { handleSubmit, errors, control } = useForm({
    resolver: yupResolver(joinSessionSchema),
  });
  const [joinMutation, { loading: joinLoading }] = useJoinSessionMutation();

  const onSubmit = async (schema: JoinSessionFormSchema) => {
    try {
      await joinMutation({
        variables: {
          input: {
            sessionId: id,
            fullName: schema.userName,
            email: schema.email,
            entryPassword: schema.password,
          },
        },
      }).then(
        (value) => {
          console.log(value.data?.joinSession?.token);
          localStorage.setItem(
            "participantToken",
            value.data?.joinSession?.token ?? ""
          );
          history.push(`/sessions/${id}/live`);
        },
        () => {
          setDialogOpen(true);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const { data, loading } = useSessionThumbnailQuery({
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  if (loading || joinLoading) {
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
            {new Date(data.sessionThumbnail.scheduledStartTime).toLocaleString(
              [],
              LOCAL_DATE_FORMAT
            )}
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
                  error={!!errors.userName}
                  helperText={errors.userName && t(errors.userName.message)}
                />
              }
            />
            <Typography className="label">
              {t("components.JoinSession.email")}
            </Typography>
            <Controller
              name="email"
              control={control}
              defaultValue={""}
              as={
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email && t(errors.email.message)}
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
        <Dialog
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          maxWidth="sm"
          fullWidth
        >
          <div className="InactiveSessionDialog">
            <div className="dialogElement">
              <InfoIcon className="dialogIcon" fontSize="large" />
            </div>
            <div className="dialogElement">
              <Typography className="dialogTitleText">
                {t("components.JoinSession.dialogTitle")}
              </Typography>
            </div>
            <div className="dialogElement">
              <Typography className="dialogSubtitle">
                {t("components.JoinSession.dialogSubtitle")}
              </Typography>
            </div>
            <div className="dialogElement">
              <Typography className="dialogSubSubtitle">
                {t("components.JoinSession.dialogSubSubtitle")}
              </Typography>
            </div>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => setDialogOpen(false)}
            >
              {t("components.JoinSession.dialogButtonText")}
            </Button>
          </div>
        </Dialog>
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
