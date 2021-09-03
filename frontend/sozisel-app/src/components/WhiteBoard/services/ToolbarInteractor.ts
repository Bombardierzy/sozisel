import { CANVAS_TOPICS, CanvasToolbar, canvasManager } from "./CanvasManager";

import create from "zustand";

export const useToolbarState = create<CanvasToolbar>((_set) => ({
  ...canvasManager.canvasToolbar(),
}));

canvasManager.on(CANVAS_TOPICS.TOOLBAR_CHANGED, (toolbar) => {
  updateState(toolbar);
});

export const updateState = (
  newState: CanvasToolbar | ((state: CanvasToolbar) => CanvasToolbar)
): void => {
  if (typeof newState === "function") {
    const updatedState = newState(useToolbarState.getState());
    useToolbarState.setState(() => ({ ...updatedState }));
  } else {
    useToolbarState.setState(() => ({ ...newState }));
  }
};
