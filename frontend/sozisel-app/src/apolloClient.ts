import {
  AbsintheSocketLink,
  createAbsintheSocketLink,
} from "@absinthe/socket-apollo-link";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  split,
} from "@apollo/client";

import { Socket as PhoenixSocket } from "phoenix";
import { create as createAbsintheSocket } from "@absinthe/socket";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

const HOST = window.location.hostname;

function createApolloHttpLink(): ApolloLink {
  return createHttpLink({ uri: `http://${HOST}:4000/api` });
}

function createApolloSocketLink(phoenixSocket: PhoenixSocket): ApolloLink {
  const socket = createAbsintheSocket(phoenixSocket);

  type MockType = AbsintheSocketLink & ApolloLink;
  return createAbsintheSocketLink(socket) as MockType;
}

export function createApolloClient(
  socket: PhoenixSocket
): ApolloClient<NormalizedCacheObject> {
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    createApolloSocketLink(socket),
    createApolloHttpLink()
  );

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return { headers };
  });

  return new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
  });
}
