import { CANVAS_TOPICS, canvasManager } from "./CanvasManager";

import { Channel } from "phoenix";
import { Object as FabricObject } from "fabric/fabric-impl";

export type CanvasAction =
  | "redo"
  | "undo"
  | "clear"
  | "create"
  | "modified"
  | "remove";

export interface EmitCanvasUpdateEvent {
  canvasJSON: string;
  action: CanvasAction;
  actionData: string;
}

export interface OnCanvasUpdateEvent {
  action: CanvasAction;
  actionData: string;
}

export class CanvasConnector {
  private channel: Channel;
  private handler: number;

  constructor(channel: Channel) {
    this.channel = channel;
    this.handler = this.setupChannel(channel);

    canvasManager.on(CANVAS_TOPICS.OBJECT_ADDED, this.onObjectAdded);
    canvasManager.on(CANVAS_TOPICS.OBJECT_REMOVED, this.onObjectRemoved);
    canvasManager.on(CANVAS_TOPICS.OBJECT_MODIFIED, this.onObjectModified);
    canvasManager.on(CANVAS_TOPICS.CANVAS_CLEARED, this.onCanvasCleared);
    canvasManager.on(CANVAS_TOPICS.CANVAS_UNDO, this.onCanvasUndo);
    canvasManager.on(CANVAS_TOPICS.CANVAS_REDO, this.onCanvasRedo);
  }

  clear = (): void => {
    this.channel.off("board_update", this.handler);
    canvasManager.off(CANVAS_TOPICS.OBJECT_ADDED, this.onObjectAdded);
    canvasManager.off(CANVAS_TOPICS.OBJECT_REMOVED, this.onObjectRemoved);
    canvasManager.off(CANVAS_TOPICS.OBJECT_MODIFIED, this.onObjectModified);
    canvasManager.off(CANVAS_TOPICS.CANVAS_CLEARED, this.onCanvasCleared);
    canvasManager.off(CANVAS_TOPICS.CANVAS_UNDO, this.onCanvasUndo);
    canvasManager.off(CANVAS_TOPICS.CANVAS_REDO, this.onCanvasRedo);
  };

  private setupChannel = (channel: Channel): number => {
    return channel.on("board_update", ({ value }: { value: string }) => {
      const event = JSON.parse(value) as OnCanvasUpdateEvent;

      if (event.action === "create") {
        const oProps = JSON.parse(event.actionData);
        canvasManager.onExternalObjectCreated(oProps);
      } else if (event.action === "remove") {
        const { id } = JSON.parse(event.actionData);
        canvasManager.onExternalObjectRemove(id);
      } else if (event.action === "modified") {
        const oProps = JSON.parse(event.actionData);
        canvasManager.onExternalObjectModified(oProps);
      } else if (event.action === "clear") {
        canvasManager.onExternalCanvasClear();
      } else if (event.action === "undo") {
        const canvasJSON = JSON.parse(event.actionData);
        canvasManager.onExternalCanvasUndo(canvasJSON);
      } else if (event.action === "redo") {
        const canvasJSON = JSON.parse(event.actionData);
        canvasManager.onExternalCanvasRedo(canvasJSON);
      }
    });
  };

  onCanvasUpdate = (_e: EmitCanvasUpdateEvent): void => {
    this.channel.push("board_update", { value: JSON.stringify(_e) });
  };

  onObjectAdded = (o: FabricObject): void => {
    this.onCanvasUpdate({
      action: "create",
      actionData: JSON.stringify(o.toJSON(["id"])),
      canvasJSON: canvasManager.getCanvasJSON(),
    });
  };

  onObjectRemoved = (o: FabricObject): void => {
    this.onCanvasUpdate({
      action: "remove",
      actionData: JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (o as any).id,
      }),
      canvasJSON: canvasManager.getCanvasJSON(),
    });
  };

  onObjectModified = (o: FabricObject): void => {
    this.onCanvasUpdate({
      action: "modified",
      actionData: JSON.stringify(o.toJSON(["id"])),
      canvasJSON: canvasManager.getCanvasJSON(),
    });
  };

  onCanvasCleared = (): void => {
    this.onCanvasUpdate({
      action: "clear",
      actionData: JSON.stringify({}),
      canvasJSON: canvasManager.getCanvasJSON(),
    });
  };

  onCanvasUndo = (): void => {
    const canvasJSON = canvasManager.getCanvasJSON();
    this.onCanvasUpdate({
      action: "undo",
      actionData: canvasJSON,
      canvasJSON,
    });
  };

  onCanvasRedo = (): void => {
    const canvasJSON = canvasManager.getCanvasJSON();
    this.onCanvasUpdate({
      action: "redo",
      actionData: canvasJSON,
      canvasJSON,
    });
  };
}
