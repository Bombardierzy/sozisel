import "./SharedBoard.scss";

import { Modal, Tooltip } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";

import { Canvas } from "../WhiteBoard/Canvas";
import { CanvasToolbar } from "../WhiteBoard/CanvasToolbar";
import { ColorLens } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const calculateDimensions = () => {
  const width = Math.max(1200, 0.9 * getWidth());
  const height = Math.max(900, 0.9 * getHeight());

  return { height, width };
};

interface SharedBoardProps {
  sessionId: string;
}

export function SharedBoard({ sessionId }: SharedBoardProps): ReactElement {
  const { t } = useTranslation("common");

  const [open, setOpen] = useState<boolean>(false);

  const [{ height, width }, setSizes] = useState<{
    height: number;
    width: number;
  }>(calculateDimensions());

  useEffect(() => {
    const listener = function () {
      setSizes(calculateDimensions());
    };

    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return (
    <div className="SharedBoard">
      <Tooltip
        placement="top"
        title={t("components.SharedBoard.switch") as string}
      >
        <div className="switch" onClick={() => setOpen(true)}>
          <ColorLens />
        </div>
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="BoardCanvas">
          <div className="toolbar">
            <CanvasToolbar />
          </div>
          <Canvas width={width} height={height} sessionId={sessionId} />
        </div>
      </Modal>
    </div>
  );
}
