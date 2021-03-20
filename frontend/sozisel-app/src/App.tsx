import { ApolloProvider } from "@apollo/client";
import { ReactElement } from "react";
import Test from "./components/Test";
import { createApolloClient } from "./apolloClient";

const client = createApolloClient();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={client}>
      <Test />
    </ApolloProvider>
  );
}
