import "./MainContent.scss";
import { ExitToApp, People } from "@material-ui/icons";
import React, { ReactElement, useState } from "react";
import ParticipantsList from "./ParticipantsList";
import { ParticipantsWhiteboardTaskSummary } from "../../../../../../../graphql";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export type ParticipantsWhiteboardTasks = {
  __typename?: "ParticipantsWhiteboardTaskSummary" | undefined;
} & Pick<
  ParticipantsWhiteboardTaskSummary,
  "imagePath" | "fullName" | "email" | "additionalText"
>;

interface MainContentProps {
  participantsWhiteboardTasks: ParticipantsWhiteboardTasks[];
}

const MainContent = ({
  participantsWhiteboardTasks,
}: MainContentProps): ReactElement => {
  const [currentUser, setCurrentUser] =
    useState<ParticipantsWhiteboardTasks | null>(null);
  const { t } = useTranslation("common");

  return (
    <div className="MainContent">
      {currentUser ? (
        <>
          <div className="header">
            <People className="icon" />
            <Typography className="headerText">
              {t("components.SessionEventResults.Whiteboard.solutionLabel", {
                userName: currentUser.fullName,
              })}
            </Typography>
            <ExitToApp
              className="exitIcon"
              onClick={() => setCurrentUser(null)}
            />
          </div>
          <div className="imageContainer">
            <img
              className="solutionImage"
              src={`http://localhost:4000/image/${currentUser.imagePath}`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="header">
            <People className="icon" />
            <Typography className="headerText">
              {t("components.SessionEventResults.Whiteboard.listLabel")}
            </Typography>
          </div>
          <ParticipantsList
            participantsWhiteboardTasks={participantsWhiteboardTasks}
            setCurrentUser={setCurrentUser}
          />
        </>
      )}
    </div>
  );
};

export default MainContent;
