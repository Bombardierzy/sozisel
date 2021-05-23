import { FC, createContext, useContext, useMemo } from "react";

import { Socket } from "phoenix";

const Context = createContext<Socket | undefined>(undefined);

export function usePhoenixSocket(): Socket {
  const socket = useContext(Context);

  if (!socket) {
    throw new Error("Socket has not been set up.");
  }

  return socket;
}

export const PhoenixSocketProvider: FC = ({ children }) => {
  const socket = useMemo(() => {
    const sock = new Socket(`ws://${window.location.hostname}:4000/socket`);
    sock.connect();
    return sock;
  }, []);

  return <Context.Provider value={socket}>{children}</Context.Provider>;
};

export function ensureConnected(socket: Socket): Socket {
  if (!socket.isConnected()) {
    socket.connect();
  }
  return socket;
}
