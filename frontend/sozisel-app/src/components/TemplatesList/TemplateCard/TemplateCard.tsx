import "./TemplateCard.scss";

import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CustomAvatar from "../../utils/Avatar/CustomAvatar";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import { ReactElement } from "react";
import { SessionTemplate } from "../../../model/Template";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
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

  const onClick = () => {
    history.push({
      pathname: `/templates/${template.id}/edit`,
      state: { id: template.id },
    });
  };

  return (
    <div className="TemplateCard" onClick={onClick}>
      <CustomAvatar id={template.id} />
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
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              onCopy(template);
            }}
          >
            <FileCopyIcon />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              onDelete(template);
            }}
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
          onClick={(event) => {
            event.stopPropagation();
            history.push({
              pathname: "/sessions/create",
              state: { templateId: template.id },
            });
          }}
        >
          {t("components.TemplatesList.planSessionText")}
        </Button>
      </CardActions>
    </div>
  );
}
