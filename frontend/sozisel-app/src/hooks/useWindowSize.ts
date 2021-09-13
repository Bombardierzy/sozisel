import { useEffect, useState } from "react";

export interface Size {
  width: number;
  height: number;
}

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

export function useWindowSize(): Size {
  const [dimensions, setDimensions] = useState<Size>({
    width: getWidth(),
    height: getHeight(),
  });

  useEffect(() => {
    const listener = () => {
      setDimensions({ width: getWidth(), height: getHeight() });
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return dimensions;
}
