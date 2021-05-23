import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

import AboutScreen from "./components/AboutScreen/AboutScreen";
import { ApolloProvider } from "@apollo/client";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import JitsiShowcaseScreen from "./components/Jitsi/JitsiShowcaseScreen";
import Login from "./components/LoginScreen/LoginScreen";
import { ReactElement } from "react";
import Register from "./components/RegisterScreen/RegisterScreen";
import SessionCreation from "./components/SessionDetails/SessionCreation";
import SessionEditing from "./components/SessionDetails/SessionEditing/SessionEditing";
import SessionsList from "./components/SessionsList/SessionsList";
import TemplateCreation from "./components/TemplateCreation/TemplateCreation";
import TemplateList from "./components/TemplatesList/TemplateList";
import { createApolloClient } from "./apolloClient";

const client = createApolloClient();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact path="/">
          <Redirect to="/templates" />
        </Route>
        <Route exact path="/jitsi" component={JitsiShowcaseScreen} />
        <Route exact path="/home">
          <Redirect to="/templates" />
        </Route>
        <AuthRoute path="/templates" component={TemplateList} />
        <AuthRoute path="/templates/create" component={TemplateCreation} />
        <AuthRoute path="/sessions/create" component={SessionCreation} />
        <AuthRoute path="/sessions/:id" component={SessionEditing} />
        <AuthRoute path="/sessions" component={SessionsList} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/about" component={AboutScreen} />
      </Router>
    </ApolloProvider>
  );
}
