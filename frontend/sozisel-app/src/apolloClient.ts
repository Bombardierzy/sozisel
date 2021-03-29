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

const HOST = window.location.hostname;

function createApolloHttpLink(): ApolloLink {
  return createHttpLink({ uri: `http://${HOST}:4000/api` });
}

function createApolloSocketLink(): ApolloLink {
  const socket = createAbsintheSocket(
    new PhoenixSocket(`ws://${HOST}:4000/socket`)
  );

  type MockType = AbsintheSocketLink & ApolloLink;
  return createAbsintheSocketLink(socket) as MockType;
}

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    createApolloSocketLink(),
    createApolloHttpLink()
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}
