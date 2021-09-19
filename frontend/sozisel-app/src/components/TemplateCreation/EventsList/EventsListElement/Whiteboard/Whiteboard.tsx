import "./Whiteboard.scss";
import { Paper, Typography } from "@material-ui/core";
import LatextText from "../../../../utils/LatexText/LatextText";
import { ReactElement } from "react";
import { Whiteboard as WhiteboardType } from "../../../../../graphql";
import { useTranslation } from "react-i18next";

interface WhiteboardProps {
  data: WhiteboardType;
}

export default function Whiteboard({ data }: WhiteboardProps): ReactElement {
  const { t } = useTranslation("common");
  return (
    <Paper className="WhiteboardContainer">
      <Typography variant="h4" className="header">
        {t("components.TemplateCreation.Whiteboard.taskTitle")}
      </Typography>
      <LatextText text={data.task} />
    </Paper>
  );
}
