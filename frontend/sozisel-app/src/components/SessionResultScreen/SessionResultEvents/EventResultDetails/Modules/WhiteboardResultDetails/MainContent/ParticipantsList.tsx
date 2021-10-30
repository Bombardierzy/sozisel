import "./MainContent.scss";
import { ArrowForward } from "@material-ui/icons";
import { ParticipantsWhiteboardTasks } from "./MainContent";
import { ReactElement } from "react";

interface ParticipantsListProps {
  participantsWhiteboardTasks: ParticipantsWhiteboardTasks[];
  setCurrentUser: (state: ParticipantsWhiteboardTasks) => void;
}

const ParticipantsList = ({
  participantsWhiteboardTasks,
  setCurrentUser,
}: ParticipantsListProps): ReactElement => {
  if (participantsWhiteboardTasks.length === 0) return <></>;

  const Participant = ({
    particpant,
  }: {
    particpant: ParticipantsWhiteboardTasks;
  }): ReactElement => {
    return (
      <div className="Particpant">
        <span className="name">{particpant.fullName}</span>
        <ArrowForward
          onClick={() => setCurrentUser(particpant)}
          className="icon"
        />
      </div>
    );
  };

  return (
    <div className="PartcipantList">
      {participantsWhiteboardTasks.map((particpant) => (
        <Participant key={particpant.imagePath} particpant={particpant} />
      ))}
    </div>
  );
};

export default ParticipantsList;
