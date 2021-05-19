import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { ensureConnected, usePhoenixSocket } from "./PhoenixSocketContext";

import { createApolloClient } from "../apolloClient";

export const ApolloProviderWrapper: FC = ({ children }) => {
  const socket = usePhoenixSocket();

  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >();

  useEffect(() => {
    ensureConnected(socket);
    setClient(createApolloClient(socket));
  }, [socket, setClient]);

  if (!client) {
    return <></>;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
