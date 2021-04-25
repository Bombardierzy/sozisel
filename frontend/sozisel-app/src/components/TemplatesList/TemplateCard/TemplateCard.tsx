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
import { SessionTemplate } from "../../../graphql";

export interface TemplateCardProps {
  template: SessionTemplate;
}

export default function TemplateCard({
  template,
}: TemplateCardProps): ReactElement {
  const { t } = useTranslation("common");
  const [raised, setRaised] = useState(false);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(getRandomAvatar());
  }, []);

  const onMouseOverChange = (event: BaseSyntheticEvent) => {
    setRaised(!raised);
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
          <IconButton>
            <FileCopyIcon />
          </IconButton>
          <IconButton aria-label="play/pause">
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
    </Card>
  );
}
