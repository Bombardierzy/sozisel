import "./WhiteboardSwitch.scss";
import { ColorLens, ReceiptTwoTone } from "@material-ui/icons";
import { ReactElement } from "react";

interface WhiteboardSwtichProps {
  showWhiteboard: boolean;
  setShowWhiteboard: (state: boolean) => void;
}

const WhiteboardSwtich = ({
  showWhiteboard,
  setShowWhiteboard,
}: WhiteboardSwtichProps): ReactElement => {
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
        <ReceiptTwoTone />
      </div>
    </div>
  );
};

export default WhiteboardSwtich;
