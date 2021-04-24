import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

import AboutScreen from "./components/AboutScreen/AboutScreen";
import { ApolloProvider } from "@apollo/client";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/LoginScreen/LoginScreen";
import { ReactElement } from "react";
import Register from "./components/RegisterScreen/RegisterScreen";
import { createApolloClient } from "./apolloClient";
import TemplateList from "./components/TemplatesList/TemplateList";

const client = createApolloClient();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <AuthRoute path="/home" component={TemplateList} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/about" component={AboutScreen} />
      </Router>
    </ApolloProvider>
  );
}
