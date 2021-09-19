import "./Whiteboard.scss";
import {
  Button,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ReactElement, useState } from "react";
import { InfoOutlined } from "@material-ui/icons";
import MarkdownText from "../../../utils/MarkdownText/MarkdownText";
import { useTranslation } from "react-i18next";

export default function Whiteboard(): ReactElement {
  const [text, setText] = useState<string>("");
  const [showMarkdown, setShowMarkdown] = useState<boolean>(false);
  const { t } = useTranslation("common");
  return (
    <div className="whiteboard">
      <Typography className="taskTitle">
        {t("components.TemplateCreation.Whiteboard.taskTitle")}
        <Tooltip
          title={
            t("components.TemplateCreation.Whiteboard.taskExplanation") || ""
          }
        >
          <InfoOutlined fontSize="small" className="infoIcon" />
        </Tooltip>
        <Button
          color="primary"
          variant="contained"
          className="previewButton"
          onClick={() => setShowMarkdown((prev) => !prev)}
        >
          {t("components.TemplateCreation.Whiteboard.previewButton")}
        </Button>
      </Typography>

      {showMarkdown ? (
        <MarkdownText text={text} />
      ) : (
        <TextareaAutosize
          rowsMin={10}
          aria-label="minimum height"
          placeholder={t(
            "components.TemplateCreation.Whiteboard.taskPlaceholder"
          )}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="taskText"
        />
      )}
    </div>
  );
}
