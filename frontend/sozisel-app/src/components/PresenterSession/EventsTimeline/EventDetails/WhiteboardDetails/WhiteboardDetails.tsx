import "./WhiteboardDetails.scss";
import LatextText from "../../../../utils/LatexText/LatextText";
import { ReactElement } from "react";
import { Whiteboard } from "../../../../../graphql";
import { useTranslation } from "react-i18next";

interface WhiteboardDetailsProps {
  whiteboard: Whiteboard;
}

const WhiteboardDetails = ({
  whiteboard,
}: WhiteboardDetailsProps): ReactElement => {
  const { t } = useTranslation("common");

  return (
    <div className="WhiteboardDetails">
      <p>
        {t("components.PresenterSession.EventsTimeline.WhiteboardDetails.task")}
        <LatextText text={whiteboard.task} />
      </p>
    </div>
  );
};

export default WhiteboardDetails;
