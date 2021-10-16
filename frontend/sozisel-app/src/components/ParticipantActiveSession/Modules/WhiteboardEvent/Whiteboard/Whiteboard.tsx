import "./Whiteboard.scss";
import React, { ReactElement } from "react";
import { Canvas } from "../../../../WhiteBoard/Canvas";
import { CanvasToolbar } from "../../../../WhiteBoard/CanvasToolbar";

interface WhiteboardProps {
  token: string;
  withJitsi: boolean;
}

const Whiteboard = ({ token, withJitsi }: WhiteboardProps): ReactElement => {
  return (
    <div className={withJitsi ? "Whiteboard" : "WhiteboardJitsy"}>
      <CanvasToolbar />
      <Canvas width={900} height={500} sessionId={token} />
    </div>
  );
};

export default Whiteboard;
