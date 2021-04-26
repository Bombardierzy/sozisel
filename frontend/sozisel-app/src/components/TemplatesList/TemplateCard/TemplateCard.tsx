import "./TemplateCard.scss";
import { BaseSyntheticEvent, ReactElement } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { getRandomAvatar } from "@fractalsoftware/random-avatar-generator";
import CardActions from "@material-ui/core/CardActions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import {
  SessionTemplate,
  useCloneSessionTemplateMutation,
} from "../../../graphql";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface TemplateCardProps {
  template: SessionTemplate;
  refetch: ({}) => void;
}

export default function TemplateCard({
  template,
  refetch,
}: TemplateCardProps): ReactElement {
  const { t } = useTranslation("common");
  const [cloneMutation, { error, loading }] = useCloneSessionTemplateMutation();
  const [raised, setRaised] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setAvatar(getRandomAvatar());
  }, []);

  const onMouseOverChange = (event: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  const onCopyIconClicked = async () => {
    try {
      await cloneMutation({
        variables: {
          id: template.id,
        },
      });
      refetch({});
      setSuccessMsg("Skopiowano szablon!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      className="templateCard"
      raised={raised}
      onMouseOver={onMouseOverChange}
      onMouseOut={onMouseOverChange}
    >
      <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
      <CardContent className="cardContent">
        <Typography component="h5" variant="h5">
          {template.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {t("components.TemplatesList.access")}:{" "}
          {template.isPublic && t("components.TemplatesList.public")}{" "}
          {!template.isPublic && t("components.TemplatesList.private")}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {t("components.TemplatesList.author")}:{" "}
          {`${template.owner.firstName} ${template.owner.lastName}`}
        </Typography>
      </CardContent>
      <CardActions className="cardActions">
        <div className="iconButtons">
          <IconButton onClick={onCopyIconClicked}>
            <FileCopyIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="actionButton"
        >
          {t("components.TemplatesList.planSessionText")}
        </Button>
      </CardActions>
      <Snackbar
        open={successMsg != ""}
        autoHideDuration={6000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert onClose={() => setSuccessMsg("")} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>
    </Card>
  );
}
