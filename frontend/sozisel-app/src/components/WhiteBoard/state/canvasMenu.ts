import create from "zustand";

type CanvasMenu = {
  canvasIds: string[];
  activeCanvasId: string;
};

export const canvasMenu = create<CanvasMenu>((_set) => ({
  canvasIds: [],
  activeCanvasId: "",
}));

export const addCanvas = (canvasId: string): void => {
  const menu = canvasMenu.getState();
  canvasMenu.setState({
    ...menu,
    canvasIds: [...menu.canvasIds, canvasId],
  });
};

export const setActiveCanvas = (canvasId: string): void => {
  const menu = canvasMenu.getState();
  canvasMenu.setState({
    ...menu,
    activeCanvasId: canvasId,
  });
};
