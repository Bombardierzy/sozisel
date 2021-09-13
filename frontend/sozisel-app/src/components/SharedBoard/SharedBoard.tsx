import "./SharedBoard.scss";

import { Modal, Tooltip } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { Size, useWindowSize } from "../../hooks/useWindowSize";

import { Canvas } from "../WhiteBoard/Canvas";
import { CanvasToolbar } from "../WhiteBoard/CanvasToolbar";
import { ColorLens } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const calculateDimensions = (width: number, height: number) => {
  const newWidth = Math.max(1200, 0.9 * width);
  const newHeight = Math.max(900, 0.9 * height);

  return { height: newHeight, width: newWidth };
};

interface SharedBoardProps {
  sessionId: string;
}

export function SharedBoard({ sessionId }: SharedBoardProps): ReactElement {
  const { t } = useTranslation("common");

  const [open, setOpen] = useState<boolean>(false);

  const windowSize = useWindowSize();

  const [{ width, height }, setSizes] = useState<Size>({ height: 0, width: 0 });

  useEffect(() => {
    const { width, height } = windowSize;

    setSizes(calculateDimensions(width, height));
  }, [windowSize]);

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
