import { Canvas, Object as FabricObject, IEvent } from "fabric/fabric-impl";

import { CanvasStateManager } from "./CanvasStateManager";
import { EventEmitter } from "events";
import { fabric } from "fabric";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const CANVAS_ELEMENT_ID = "room_canvas_container";

export enum CANVAS_MODE {
  PICKER = "PICKER",
  FREEDRAW = "FREEDRAW",
  CIRCLE = "CIRCLE",
  RECT = "RECT",
  ERASER = "ERASER",
  TEXT = "TEXT",
  LINE = "LINE",
}

export type CanvasToolbar = {
  mode: string;
  color: string;
  brushWidth: number;
  selectedObject?: FabricObject;
};

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 12 characters
  // after the decimal.
  return "object_" + Math.random().toString(36).substr(2, 12);
};

export const CANVAS_TOPICS = {
  TOOLBAR_CHANGED: "TOOLBAR_CHANGED",
  OBJECT_REMOVED: "OBJECT_REMOVED",
  OBJECT_ADDED: "OBJECT_ADDED",
  OBJECT_MODIFIED: "OBJECT_MODIFIED",
  CANVAS_CLEARED: "CANVAS_CLEARED",
  CANVAS_UNDO: "CANVAS_UNDO",
  CANVAS_REDO: "CANVAS_REDO",
};

export class CanvasManager extends EventEmitter {
  private canvas: Canvas | undefined;
  private canvasStateManager: CanvasStateManager | undefined;
  public isInitialized: boolean;

  private toolbar: CanvasToolbar;

  private mouse: {
    isDown: boolean;
    object?: FabricObject;
    mouseDownCords?: {
      x: number;
      y: number;
    };
  };

  constructor() {
    super();
    this.toolbar = {
      mode: CANVAS_MODE.FREEDRAW,
      color: "#000",
      brushWidth: 7,
    };
    this.mouse = {
      isDown: false,
    };
    this.isInitialized = false;
    this.setupInternalListeners();
  }

  canvasToolbar = (): CanvasToolbar => {
    return Object.freeze({ ...this.toolbar });
  };

  adjustDimensions = (width: number, height: number) => {
    const canvas = this.canvas;
    if (!canvas) return;

    canvas.setWidth(width);
    canvas.setHeight(height);

    canvas.calcOffset();
    canvas.renderAll();
  };

  private setupInternalListeners = () => {
    this.on(CANVAS_TOPICS.TOOLBAR_CHANGED, () => this.onToolbarChanged());

    // Listen for all state changes
    this.on(CANVAS_TOPICS.OBJECT_MODIFIED, () => this.onStateChange());
    this.on(CANVAS_TOPICS.OBJECT_ADDED, () => this.onStateChange());
    this.on(CANVAS_TOPICS.OBJECT_REMOVED, () => this.onStateChange());
  };

  private onStateChange = (): void => {
    this.canvasStateManager?.saveState();
  };

  public redo = (): void => {
    this.canvasStateManager?.redo();
    this.emit(CANVAS_TOPICS.CANVAS_REDO);
  };

  public undo = (): void => {
    this.canvasStateManager?.undo();
    this.emit(CANVAS_TOPICS.CANVAS_UNDO);
  };

  public clear = (notify: boolean = true): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("clear called for non existing canvas");
      return;
    }

    canvas.clear();
    this.onStateChange();
    if (notify) {
      this.emit(CANVAS_TOPICS.CANVAS_CLEARED);
    }
  };

  public setSelectedObjectZPos = (pos: 0 | 1 | 2 | 3): void => {
    if (this.toolbar.selectedObject == null) {
      return;
    }
    switch (pos) {
      case 0:
        this.toolbar.selectedObject.sendToBack();
        break;
      case 1:
        this.toolbar.selectedObject.sendBackwards();
        break;
      case 2:
        this.toolbar.selectedObject.bringForward();
        break;
      case 3:
        this.toolbar.selectedObject.bringToFront();
        break;
    }
  };

  setMode = (mode: string): void => {
    this.toolbar.mode = mode;
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("setMode called for non existing canvas");
      return;
    }

    canvas.isDrawingMode = mode === CANVAS_MODE.FREEDRAW;
    const inPickerMode = mode === CANVAS_MODE.PICKER;
    const inEraserMode = mode === CANVAS_MODE.ERASER;
    if (inEraserMode) {
      canvas.hoverCursor = "not-allowed";
    } else if (inPickerMode) {
      canvas.hoverCursor = "pointer";
    } else if (canvas.isDrawingMode) {
      canvas.hoverCursor = "crosshair";
    } else {
      canvas.hoverCursor = "default";
    }
    if (this.toolbar.selectedObject) {
      this.toolbar.selectedObject = undefined;
    }
    this.emit(CANVAS_TOPICS.TOOLBAR_CHANGED, this.canvasToolbar());
  };

  setColor = (color: string): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("setColor called for non existing canvas");
      return;
    }

    canvas.freeDrawingBrush.color = color;
    this.toolbar.color = color;
    if (this.toolbar.selectedObject) {
      this.toolbar.selectedObject.set({
        fill:
          this.toolbar.selectedObject.type === "line" ? color : "transparent",
        stroke: color,
      });
      this.onObjectModified(this.toolbar.selectedObject);
    }
    this.emit(CANVAS_TOPICS.TOOLBAR_CHANGED, this.canvasToolbar());
  };

  setBrushWidth = (width: number): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("setBrushWidth called for non existing canvas");
      return;
    }

    canvas.freeDrawingBrush.width = width;
    this.toolbar.brushWidth = width;
    if (this.toolbar.selectedObject) {
      this.toolbar.selectedObject.set({
        strokeWidth: width,
      });
      this.onObjectModified(this.toolbar.selectedObject);
    }
    this.emit(CANVAS_TOPICS.TOOLBAR_CHANGED, this.canvasToolbar());
  };

  private onToolbarChanged = () => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onToolbarChanged called for non existing canvas");
      return;
    }

    const mode = this.toolbar.mode;
    const inPickerMode = mode === CANVAS_MODE.PICKER;
    const inEraserMode = mode === CANVAS_MODE.ERASER;
    const makeObjectsSelectable = inPickerMode || inEraserMode;
    // canvas.discardActiveObject();
    const objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
      objects[i].set({
        selectable: makeObjectsSelectable,
        evented: makeObjectsSelectable,
      });
      if (makeObjectsSelectable) {
        objects[i].setCoords();
      }
    }
    canvas.renderAll();
  };

  initializeCanvas = (canvasJSON: Record<string, any>): void => {
    if (this.canvas) {
      this.canvas.dispose();
    }
    this.canvas = new fabric.Canvas(CANVAS_ELEMENT_ID);

    (window as any).canvas = this.canvas;
    this.canvas.freeDrawingBrush.color = this.toolbar.color;
    this.canvas.freeDrawingBrush.width = this.toolbar.brushWidth;

    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.canvas.loadFromJSON(canvasJSON, () => null);
    this.setupLocalListeners();

    this.canvasStateManager = new CanvasStateManager(this.canvas);
    this.isInitialized = true;
    this.setMode(this.canvasToolbar().mode);
  };

  private getCanvas(): Canvas | undefined {
    return this.canvas;
  }

  setupLocalListeners = (): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("Tried to setup local listeners for non existing canvas");
      return;
    }
    canvas.on("mouse:down", (e) => this.onMouseDown(e));
    canvas.on("mouse:move", (e) => this.onMouseMove(e));
    canvas.on("mouse:up", (e) => this.onMouseUp(e));
    canvas.on("mouse:over", (e) => this.onMouseOver(e));
    canvas.on("mouse:out", (e) => this.onMouseOut(e));

    canvas.on("selection:created", (e) => this.onSelectionCreated(e));
    canvas.on("selection:cleared", (e) => this.onSelectionCleared(e));
    canvas.on("selection:updated", (e) => this.onSelectionUpdated(e));

    // canvas.on("history:undo", (e) => log("history:undo"));
    // canvas.on("history:redo", (e) => log("history:redo"));
    canvas.on("object:modified", (e) =>
      e.target ? this.onObjectModified(e.target) : null
    );
    // canvas.on("object:added", (e) => log("object:added"));
    // canvas.on("object:removed", (e) => log("object:removed"));
    canvas.on("path:created", (e) => this.onPathCreated(e));
  };

  getCanvasJSON = (): string => {
    const canvas = this.getCanvas();
    if (canvas) {
      return JSON.stringify(canvas.toJSON());
    } else {
      return "{}";
    }
  };

  downloadCanvas = (): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("Tried to download non existing canvas");
      return;
    }

    const dataURL = canvas.toDataURL({
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      left: 0,
      top: 0,
      format: "png",
    });
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  canvasFile = async (): Promise<File | null> => {
    const canvas = this.getCanvas();
    if (!canvas) {
      throw new Error("Tried to get file for non existing canvas");
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.getElement().toBlob(resolve);
    });

    if (!blob) return null;

    return new File([blob], "whiteboard");
  };

  public static isReady(): boolean {
    const canvasIsMounted = document.getElementById(CANVAS_ELEMENT_ID);
    return canvasIsMounted != null;
  }

  private setActiveObject(o: FabricObject) {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("Tried to set active object for non existing canvas");
      return;
    }
    canvas.setActiveObject(o);
  }

  private setSelectedObject(o: FabricObject | undefined) {
    this.toolbar.selectedObject = o;
    this.emit(CANVAS_TOPICS.TOOLBAR_CHANGED, this.canvasToolbar());
  }

  onMouseDown = (e: IEvent): void => {
    if (this.toolbar.mode === CANVAS_MODE.FREEDRAW) return;
    this.mouse.isDown = true;

    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onMouseDown event called on non existing canvas");
      return;
    }

    const pointer = canvas.getPointer(e.e);
    this.mouse.mouseDownCords = {
      x: pointer.x,
      y: pointer.y,
    };
    this.mouse.object = e.target;

    if (this.toolbar.mode === CANVAS_MODE.PICKER) {
      if (e.target == null) return;
      this.setActiveObject(e.target);
      return;
    }
    if (this.toolbar.mode === CANVAS_MODE.ERASER && e.target) {
      this.removeObject(e.target);
      return;
    }

    let addedObject: FabricObject;

    if (this.toolbar.mode === CANVAS_MODE.LINE) {
      const points = [pointer.x, pointer.y, pointer.x, pointer.y];
      const line = new fabric.Line(points, {
        strokeWidth: canvas.freeDrawingBrush.width,
        fill: canvas.freeDrawingBrush.color,
        stroke: canvas.freeDrawingBrush.color,
        originX: "center",
        originY: "center",
        // selectable: false
      });
      addedObject = line;
    } else if (this.toolbar.mode === CANVAS_MODE.RECT) {
      const rect = new fabric.Rect({
        width: 0,
        height: 0,
        left: pointer.x,
        top: pointer.y,
        fill: "transparent",
        stroke: canvas.freeDrawingBrush.color,
        strokeWidth: canvas.freeDrawingBrush.width,
        // fill: self.canvas.freeDrawingBrush.color
      });

      addedObject = rect;
    } else if (this.toolbar.mode === CANVAS_MODE.CIRCLE) {
      const circle = new fabric.Circle({
        width: 0,
        height: 0,
        left: pointer.x,
        top: pointer.y,
        fill: "transparent",
        originX: "left",
        originY: "top",
        radius: 0,
        angle: 0,
        stroke: canvas.freeDrawingBrush.color,
        strokeWidth: canvas.freeDrawingBrush.width,
      });
      addedObject = circle;
    } else if (this.toolbar.mode === CANVAS_MODE.TEXT) {
      return;
    } else {
      return;
    }

    (addedObject as any).id = ID();

    this.mouse.object = addedObject;
    this.addObject(addedObject, false);
  };

  private commitObject(obj: FabricObject) {
    console.debug("commiting object");
    this.emit(CANVAS_TOPICS.OBJECT_ADDED, obj);
  }

  private addObject(obj: FabricObject, commit?: boolean) {
    console.debug({ commit: commit }, "adding object but not commiting? ");

    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("Tried to add a fabric object to non existing canvas");
      return;
    }

    canvas.add(obj);
    if (commit) {
      this.commitObject(obj);
    }
  }

  private removeObject = (obj: FabricObject, notify: boolean = true) => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("Tried to remove a fabric object from non existing canvas");
      return;
    }

    canvas.remove(obj);
    if (notify) {
      this.emit(CANVAS_TOPICS.OBJECT_REMOVED, obj);
    }
  };

  private onMouseMove = (e: IEvent): void => {
    if (!this.mouse.isDown) {
      return;
    }

    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onMouseMove performed on non existing canvas");
      return;
    }

    if (this.toolbar.mode === CANVAS_MODE.ERASER) {
      if (e.target) {
        canvas.remove(e.target);
      }
      return;
    }

    if (this.mouse.object == null) {
      return;
    }

    if (
      [CANVAS_MODE.FREEDRAW, CANVAS_MODE.PICKER].includes(
        this.toolbar.mode as any
      )
    ) {
      return;
    }

    const activeObject = this.mouse.object;
    if (!activeObject) {
      console.error("onMouseMove called but related object is non existent");
      return;
    }

    const pointer = canvas.getPointer(e.e);

    if (this.toolbar.mode === CANVAS_MODE.LINE) {
      activeObject.set({
        x2: pointer.x,
        y2: pointer.y,
      } as Partial<FabricObject>);
      // } else if (this.toolbar.mode === CANVAS_MODE.LINE) {
      //   const currentX = activeObject.get("left") || 0;
      //   const currentY = activeObject.get("top") || 0;
      //   const width = pointer.x - currentX;
      //   const height = pointer.y - currentY;

      //   if (!width || !height) {
      //     return;
      //   }

      //   activeObject.set("width", width).set("height", height);
    } else if (this.toolbar.mode === CANVAS_MODE.CIRCLE) {
      const currentX = activeObject.get("left") || 0;
      const currentY = activeObject.get("top") || 0;

      let radius = Math.abs(currentY - pointer.y) / 2;
      if (activeObject.strokeWidth && radius > activeObject.strokeWidth) {
        radius -= activeObject.strokeWidth / 2;
      }

      activeObject.set({ radius } as Partial<FabricObject>);
      if (currentX > pointer.x) {
        activeObject.set({ originX: "right" });
      } else {
        activeObject.set({ originX: "left" });
      }
      if (currentY > pointer.y) {
        activeObject.set({ originY: "bottom" });
      } else {
        activeObject.set({ originY: "top" });
      }
    } else if (this.toolbar.mode === CANVAS_MODE.RECT) {
      const currentX = activeObject.get("left") || 0;
      const currentY = activeObject.get("top") || 0;
      const width = pointer.x - currentX;
      const height = pointer.y - currentY;

      if (!width || !height) {
        return;
      }

      activeObject.set("width", width).set("height", height);
    }

    canvas.renderAll();
  };

  private onMouseUp = (_e: IEvent): void => {
    if (!this.mouse.isDown) return;

    if (
      [
        CANVAS_MODE.FREEDRAW,
        CANVAS_MODE.PICKER,
        CANVAS_MODE.TEXT,
        CANVAS_MODE.ERASER,
      ].includes(this.toolbar.mode as any)
    )
      return;

    if (this.mouse.object == null) return;

    this.commitObject(this.mouse.object);

    this.mouse = {
      isDown: false,
    };
  };

  private onMouseOver = (e: IEvent): void => {
    if (!this.mouse.isDown || e.target == null) return;
    if (this.toolbar.mode === CANVAS_MODE.ERASER) {
      this.removeObject(e.target);
    }
  };

  private onMouseOut = (_e: IEvent): void => {
    if (this.mouse.isDown) {
      this.mouse = {
        isDown: false,
      };
    }
  };

  private onSelectionCreated = (e: IEvent): void => {
    console.debug("onSelectionCreated: " + e);
    if (e.target === this.toolbar.selectedObject) return;
    this.setSelectedObject(e.target);
  };

  private onSelectionCleared = (e: IEvent): void => {
    console.debug("onSelectionCleared: " + e);
    this.setSelectedObject(undefined);
  };

  private onSelectionUpdated = (e: IEvent): void => {
    console.debug("onSelectionUpdated: " + e);
    if (e.target === this.toolbar.selectedObject) return;
    this.setSelectedObject(e.target);
  };

  private onObjectModified = (o: FabricObject): void => {
    this.emit(CANVAS_TOPICS.OBJECT_MODIFIED, o);
  };

  private onPathCreated = (e: IEvent): void => {
    const path = (e as any).path;
    path.id = ID();
    this.emit(CANVAS_TOPICS.OBJECT_ADDED, path);
  };

  private getObjectById = (id: string): FabricObject | undefined => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("getObjectById performed on non existing canvas");
      return;
    }

    const objects = canvas.getObjects();
    for (const object of objects) {
      if ((object as any).id === id) {
        return object;
      }
    }
  };

  private setObjectSelectibility = (o: FabricObject) => {
    const selectable = [CANVAS_MODE.ERASER, CANVAS_MODE.PICKER].includes(
      this.toolbar.mode as any
    );
    o.set({
      selectable: selectable,
      evented: selectable,
    });
  };

  // external events from other users
  onExternalObjectCreated = async (oProps: any): Promise<void> => {
    let o: FabricObject;
    console.debug("type of o: " + oProps.type);
    switch (oProps.type) {
      case "path": {
        o = new fabric.Path(
          oProps.path.map((el: any) => el.join(" ")).join(" "),
          oProps
        );
        break;
      }
      case "circle": {
        o = new fabric.Circle(oProps);
        break;
      }
      case "rect": {
        o = new fabric.Rect(oProps);
        break;
      }
      case "line": {
        const points = [oProps.x1, oProps.y1, oProps.x2, oProps.y2];
        o = new fabric.Line(points, oProps);
        break;
      }
      case "image": {
        o = await new Promise((res) => {
          fabric.Image.fromURL(oProps.src, (o) => {
            o.set({ ...oProps });
            res(o);
          });
        });
        break;
      }
      default:
        return;
    }
    this.setObjectSelectibility(o);

    this.addObject(o, false);
    this.onStateChange();
  };

  onExternalObjectModified = (oProps: any): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onExternalObjectModified called for non existing canvas");
      return;
    }

    const o = this.getObjectById(oProps.id);
    if (!o) return;
    try {
      o.set(oProps);
      o.setCoords();
      this.setObjectSelectibility(o);

      canvas.renderAll();
      this.onStateChange();
    } catch (error) {
      // never have seen an error here, but maybe ...
    }
  };

  onExternalObjectRemove = (id: string): void => {
    const o = this.getObjectById(id);
    if (!o) return;
    this.removeObject(o, false);
  };

  onExternalCanvasClear = (): void => {
    this.clear(false);
  };

  onExternalCanvasRedo = (canvasJSON: any): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onExternalCanvasRedo called for non existing canvas");
      return;
    }

    canvas.loadFromJSON(canvasJSON, () => null);
    this.onStateChange();
  };

  onExternalCanvasUndo = (canvasJSON: any): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("onExternalCanvasUndo called for non existing canvas");
      return;
    }

    canvas.loadFromJSON(canvasJSON, () => null);
    this.onStateChange();
  };

  // When changing canvas
  // TODO: notify peers
  public clearHistoryAndSetCanvas = (canvasJSON: any): void => {
    const canvas = this.getCanvas();
    if (!canvas) {
      console.error("clearHistoryAndSetCanvas called for non existing canvas");
      return;
    }

    canvas.clear();

    this.canvasStateManager = new CanvasStateManager(canvas);

    canvas.loadFromJSON(canvasJSON, () => null);
  };

  public removeCanvas = () => {
    if (!this.canvas) return;
    this.canvas.dispose();
  };
}

export const canvasManager = new CanvasManager();
