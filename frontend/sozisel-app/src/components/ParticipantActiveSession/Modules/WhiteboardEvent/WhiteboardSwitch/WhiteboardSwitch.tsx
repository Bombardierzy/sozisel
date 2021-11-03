import "./WhiteboardSwitch.scss";
import { ColorLens, Videocam } from "@material-ui/icons";
import { ReactElement, useContext } from "react";
import { Context } from "../../../../../contexts/ParticipantWhiteboard/ParticipantWhiteboardContext";

const WhiteboardSwtich = (): ReactElement => {
  const [showWhiteboard, setShowWhiteboard] = useContext(Context);
  return (
    <div className="WhiteboardSwitch">
      <div
        className={`icon ${showWhiteboard && "taskIcon"}`}
        onClick={() => setShowWhiteboard(true)}
      >
        <ColorLens />
      </div>
      <div
        className={`icon ${!showWhiteboard && "whiteboardIcon"}`}
        onClick={() => setShowWhiteboard(false)}
      >
        <Videocam />
      </div>
    </div>
  );
};

export default WhiteboardSwtich;
