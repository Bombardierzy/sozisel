import { Box, Button, Toolbar, makeStyles } from "@material-ui/core";
import { CANVAS_MODE, canvasManager } from "./services/CanvasManager";
import React, { CSSProperties, FC, Fragment, ReactElement } from "react";

import ClearIcon from "@material-ui/icons/Delete";
import { ColorPicker } from "material-ui-color";
import DownloadIcon from "@material-ui/icons/PublishRounded";
import PencilIcon from "@material-ui/icons/EditOutlined";
import RedoIcon from "@material-ui/icons/RedoRounded";
import Slider from "@material-ui/core/Slider";
import TextIcon from "@material-ui/icons/TextFields";
import UndoIcon from "@material-ui/icons/UndoRounded";
import { useToolbarState } from "./services/ToolbarInteractor";
import { useTranslation } from "react-i18next";

const styles = {
  toolbarIcon: {
    fontSize: "1.2rem",
    color: "#323e49",
  },
  toolbarIconFigure: {
    fontSize: "1.2rem",
    color: "#323e49",
  },
  toolbarIconRect: {
    width: "16px",
    height: "8px",
    border: "1.2px solid #323e49",
  },
  toolbarIconCircle: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1.2px solid #323e49",
  },
  toolbarIconLine: {
    width: "16px",
    height: "2px",
    backgroundColor: "#323e49",
  },
};

const getToolIcon = (tool: string) => {
  switch (tool) {
    case CANVAS_MODE.FREEDRAW:
      return <PencilIcon style={styles.toolbarIcon} />;
    case CANVAS_MODE.PICKER:
      return (
        <img
          src="https://img.icons8.com/metro/344/cursor.png"
          alt=""
          style={{ ...styles.toolbarIcon, width: "16px", height: "16px" }}
        />
      );
    // return <SelectIcon style={styles.toolbarIcon} />;
    case CANVAS_MODE.LINE:
      return (
        <img
          src="https://img.icons8.com/metro/344/line.png"
          alt=""
          style={{ ...styles.toolbarIcon, width: "16px", height: "16px" }}
        />
      );
    case CANVAS_MODE.RECT:
      return (
        <div
          style={{ ...styles.toolbarIconFigure, ...styles.toolbarIconRect }}
        ></div>
      );
    case CANVAS_MODE.CIRCLE:
      return (
        <div
          style={{ ...styles.toolbarIconFigure, ...styles.toolbarIconCircle }}
        ></div>
      );
    case CANVAS_MODE.TEXT:
      return <TextIcon style={styles.toolbarIcon} />;
    case CANVAS_MODE.ERASER:
      return (
        <img
          src="https://img.icons8.com/ios-glyphs/344/erase.png"
          alt=""
          style={{ ...styles.toolbarIcon, width: "16px", height: "16px" }}
        />
      );
    case "clear":
      return <ClearIcon style={styles.toolbarIcon} />;
    default:
      return <PencilIcon style={styles.toolbarIcon} />;
  }
};

const useStyles = makeStyles(() => ({
  toolbarBtn: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "3px",
    boxSizing: "border-box",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#eee",
    },
  },
  active: {
    borderRadius: "3px",
    backgroundColor: "#eee",
  },
  colorOptionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    cursor: "pointer",
  },
  colorOption: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    overflow: "hidden",
  },
  line: {
    width: "140px",
    backgroundColor: "#323e49",
    height: "1px",
  },
}));

interface BoxCenterProps {
  style?: CSSProperties;
}

/* eslint-disable react/prop-types */
const BoxCenter: FC<BoxCenterProps> = ({ style, children }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={style}
    >
      {children}
    </Box>
  );
};

export const CanvasToolbar = (): ReactElement => {
  const { mode, color, brushWidth } = useToolbarState();
  const { t } = useTranslation("common");

  const classes = useStyles();

  const canSelectColor = [
    CANVAS_MODE.FREEDRAW,
    CANVAS_MODE.LINE,
    CANVAS_MODE.RECT,
    CANVAS_MODE.CIRCLE,
  ].includes(mode as CANVAS_MODE);

  return (
    <Toolbar variant="dense">
      <div className={classes.toolbarBtn} onClick={() => canvasManager.undo()}>
        <UndoIcon style={styles.toolbarIcon} />
      </div>
      <div className={classes.toolbarBtn} onClick={() => canvasManager.redo()}>
        <RedoIcon style={styles.toolbarIcon} />
      </div>
      <BoxCenter>
        {[
          { tool: CANVAS_MODE.FREEDRAW },
          { tool: CANVAS_MODE.PICKER },
          { tool: CANVAS_MODE.ERASER },
          { tool: CANVAS_MODE.LINE },
          { tool: CANVAS_MODE.RECT },
          { tool: CANVAS_MODE.CIRCLE },
          { tool: "clear" },
        ].map((tool) => (
          <div
            key={tool.tool}
            onClick={() =>
              tool.tool === "clear"
                ? canvasManager.clear()
                : canvasManager.setMode(tool.tool)
            }
            className={
              mode === tool.tool
                ? [classes.toolbarBtn, classes.active].join(" ")
                : classes.toolbarBtn
            }
          >
            {getToolIcon(tool.tool)}
          </div>
        ))}
      </BoxCenter>
      {canSelectColor && (
        <Fragment>
          <BoxCenter style={{ margin: "0 10px" }}>
            <ColorPicker
              defaultValue="#000"
              onChange={(c) => canvasManager.setColor("#" + c.hex)}
              value={color}
            />
          </BoxCenter>
          <BoxCenter style={{ margin: "0 10px" }}>
            <div style={{ color: "black", marginRight: "10px" }}>
              {t("components.WhiteBoard.brushSize")}
            </div>
            <Slider
              style={{ width: "150px" }}
              defaultValue={5}
              value={brushWidth}
              onChange={(e, newValue) =>
                canvasManager.setBrushWidth(newValue as number)
              }
              aria-labelledby="brush-width"
              min={3}
              max={16}
              step={1}
              valueLabelDisplay="auto"
            />
          </BoxCenter>
        </Fragment>
      )}
      {/* TODO: decide if we want to give an opportunity to change element's zindex in canvas */}
      {/* {selectedObject && (
        <div className="flex-center">
          <button onClick={() => canvasManager.setSelectedObjectZPos(0)}>
            Back
          </button>
          <button onClick={() => canvasManager.setSelectedObjectZPos(1)}>
            Backwards
          </button>
          <button onClick={() => canvasManager.setSelectedObjectZPos(2)}>
            Forwards
          </button>
          <button onClick={() => canvasManager.setSelectedObjectZPos(3)}>
            Front
          </button>
        </div>
      )} */}

      <Button
        onClick={() => canvasManager.downloadCanvas()}
        style={{ marginLeft: "15px", color: "#323e49" }}
      >
        <DownloadIcon
          style={{
            color: "#323e49",
            WebkitTransform: "rotateX(180deg)",
            transform: "rotateX(180deg)",
            marginRight: "6px",
            fontSize: "1.2rem",
          }}
        />
        {t("components.WhiteBoard.download")}
      </Button>
    </Toolbar>
  );
};
