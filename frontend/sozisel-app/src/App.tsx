import { BrowserRouter, Route } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import { ReactElement } from "react";
import Register from "./components/Register/Register";
import Test from "./components/Test";
import { createApolloClient } from "./apolloClient";

const client = createApolloClient();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthRoute path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/test" component={Test} />
      </BrowserRouter>
    </ApolloProvider>
  );
}
