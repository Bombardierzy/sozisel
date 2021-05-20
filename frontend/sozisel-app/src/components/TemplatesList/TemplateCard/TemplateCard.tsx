import "./TemplateCard.scss";

import { BaseSyntheticEvent, ReactElement, useState } from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import { SessionTemplate } from "../../../model/Template";
import Typography from "@material-ui/core/Typography";
import useAvatarById from "../../../hooks/useAvatarById";
import { useHistory } from "react-router-dom";
import useMyId from "../../../hooks/useMyId";
import { useTranslation } from "react-i18next";

export interface TemplateCardProps {
  key: string;
  template: SessionTemplate;
  onCopy: (template: SessionTemplate) => void;
  onDelete: (template: SessionTemplate) => void;
}

export default function TemplateCard({
  template,
  onCopy,
  onDelete,
}: TemplateCardProps): ReactElement {
  const { t } = useTranslation("common");
  const history = useHistory();
  const currentUserId = useMyId();
  const avatar = useAvatarById(template.id);
  const [raised, setRaised] = useState<boolean>(false);

  const onMouseOverChange = (_: BaseSyntheticEvent) => {
    setRaised(!raised);
  };

  const onPlanSession = () => {
    history.push({
      pathname: "/sessions/create",
      state: { templateId: template.id },
    });
  };

  return (
    <Card
      raised={raised}
      className="materialCard"
      onMouseOver={onMouseOverChange}
      onMouseOut={onMouseOverChange}
    >
      <div className="templateCard">
        <img width="151" src={`data:image/svg+xml;base64,${btoa(avatar)}`} />
        <CardContent className="cardContent">
          <Typography component="h5" variant="h5">
            {template.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {t("components.TemplatesList.access")}:{" "}
            {template.isPublic && t("components.TemplatesList.public")}
            {!template.isPublic && t("components.TemplatesList.private")}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t("components.TemplatesList.author")}:{" "}
            {`${template.owner.firstName} ${template.owner.lastName}`}
          </Typography>
        </CardContent>
        <CardActions className="cardActions">
          <div className="iconButtons">
            <IconButton onClick={() => onCopy(template)}>
              <FileCopyIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(template)}
              disabled={currentUserId != template.owner.id}
            >
              <DeleteIcon />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="actionButton"
            disabled={currentUserId != template.owner.id}
            onClick={onPlanSession}
          >
            {t("components.TemplatesList.planSessionText")}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
