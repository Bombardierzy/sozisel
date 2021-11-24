import "./SessionMenu.scss";

import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
} from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { Size, useWindowSize } from "../../hooks/useWindowSize";

import { Canvas } from "../WhiteBoard/Canvas";
import { CanvasToolbar } from "../WhiteBoard/CanvasToolbar";
import { ColorLens } from "@material-ui/icons";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ParticipantSessionFiles } from "../Files/ParticipantSessionFiles/ParticipantSessionFiles";
import { PresenterSessionFiles } from "../Files/PresenterSessionFiles/PresenterSessionFiles";
import { useTranslation } from "react-i18next";

interface SessionMenuProps {
  sessionId: string;
  presenter?: boolean;
}

export function SessionMenu({
  sessionId,
  presenter,
}: SessionMenuProps): ReactElement {
  const { t } = useTranslation("common");
  const [openSharedBoard, setOpenSharedBoard] = useState<boolean>(false);
  const [openFiles, setOpenFiles] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const windowSize = useWindowSize();

  const [{ width, height }, setSizes] = useState<Size>({ height: 0, width: 0 });

  useEffect(() => {
    const { width, height } = windowSize;

    setSizes({ width: width - 100, height: height - 100 });
  }, [windowSize]);

  return (
    <div className="SessionMenu">
      <div className="topCornerMenu">
        <div
          className="menuButton"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <MoreVertIcon fontSize="small" />
        </div>
        {openMenu && (
          <div className="menuOptions">
            <MenuList>
              <MenuItem
                onClick={() => {
                  setOpenSharedBoard(true);
                  setOpenMenu(false);
                }}
              >
                <ListItemIcon>
                  <ColorLens fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>
                  {t("components.SessionMenu.sharedBoard")}
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenFiles(true);
                  setOpenMenu(false);
                }}
              >
                <ListItemIcon>
                  <InsertDriveFileOutlinedIcon
                    fontSize="small"
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText>{t("components.SessionMenu.files")}</ListItemText>
              </MenuItem>
            </MenuList>
          </div>
        )}
      </div>
      <Modal open={openSharedBoard} onClose={() => setOpenSharedBoard(false)}>
        <div className="BoardCanvas">
          <div className="toolbar">
            <CanvasToolbar />
          </div>
          <Canvas width={width} height={height} sessionId={sessionId} />
        </div>
      </Modal>
      {presenter && (
        <PresenterSessionFiles
          open={openFiles}
          sessionId={sessionId}
          onClose={() => setOpenFiles(false)}
        />
      )}
      {!presenter && (
        <ParticipantSessionFiles
          open={openFiles}
          timestamp={new Date().getTime().toString()}
          sessionId={sessionId}
          onClose={() => setOpenFiles(false)}
        />
      )}
    </div>
  );
}
