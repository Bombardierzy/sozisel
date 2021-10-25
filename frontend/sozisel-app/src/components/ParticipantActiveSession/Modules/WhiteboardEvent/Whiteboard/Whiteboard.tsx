import "./Whiteboard.scss";
import React, { ReactElement, useContext } from "react";
import { Canvas } from "../../../../WhiteBoard/Canvas";
import { CanvasToolbar } from "../../../../WhiteBoard/CanvasToolbar";
import { Context } from "../../../../../contexts/ParticipantWhiteboard/ParticipantWhiteboardContext";

interface WhiteboardProps {
  withJitsi: boolean;
}

const Whiteboard = ({ withJitsi }: WhiteboardProps): ReactElement => {
  const [showWhiteboard] = useContext(Context);
  return (
    <div
      style={!showWhiteboard ? { display: "none" } : {}}
      className={withJitsi ? "Whiteboard" : "WhiteboardJitsy"}
    >
      <CanvasToolbar />
      <Canvas width={900} height={500} />
    </div>
  );
};

export default Whiteboard;
