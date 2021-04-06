import { Route, BrowserRouter as Router } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/LoginScreen/LoginScreen";
import { ReactElement } from "react";
import Register from "./components/RegisterScreen/RegisterScreen";
import { createApolloClient } from "./apolloClient";

const client = createApolloClient();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthRoute path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    </ApolloProvider>
  );
}
