import { Canvas } from "./Canvas";
import { CanvasToolbar } from "./CanvasToolbar";
import Navbar from "../Navbar/LoginNavbar/Navbar";
import { ReactElement } from "react";

export function WhiteBoard(): ReactElement {
  return (
    <>
      <Navbar />
      <CanvasToolbar />
      <Canvas width={1200} height={900} />
    </>
  );
}
