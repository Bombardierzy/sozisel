import {
  AbsintheSocketLink,
  createAbsintheSocketLink,
} from "@absinthe/socket-apollo-link";
import {
  ApolloClient,
  ApolloLink,
  HttpOptions,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";

import { Socket as PhoenixSocket } from "phoenix";
import { USER_TOKEN } from "./common/consts";
import { create as createAbsintheSocket } from "@absinthe/socket";
import { customFetch } from "./customUploadFetch";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createAbsintheUploadLink = require("apollo-absinthe-upload-link")
  .createLink as (linkOptions: HttpOptions) => ApolloLink;

const HOST = window.location.hostname;

function createApolloHttpLink(): ApolloLink {
  return createAbsintheUploadLink({
    uri: `http://${HOST}:4000/api`,
    fetch: customFetch,
  });
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
    const token = localStorage.getItem(USER_TOKEN);
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
