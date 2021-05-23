import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

import AboutScreen from "./components/AboutScreen/AboutScreen";
import { ApolloProviderWrapper } from "./contexts/ApolloProviderWrapper";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import JitsiShowcaseScreen from "./components/Jitsi/JitsiShowcaseScreen";
import { LiveSession } from "./components/LiveSession/LiveSession";
import Login from "./components/LoginScreen/LoginScreen";
import { PhoenixSocketProvider } from "./contexts/PhoenixSocketContext";
import { ReactElement } from "react";
import Register from "./components/RegisterScreen/RegisterScreen";
import SessionsList from "./components/SessionsList/SessionsList";
import TemplateCreation from "./components/TemplateCreation/TemplateCreation";
import TemplateList from "./components/TemplatesList/TemplateList";

export default function App(): ReactElement {
  return (
    <PhoenixSocketProvider>
      <ApolloProviderWrapper>
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
          <AuthRoute path="/sessions" component={SessionsList} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/about" component={AboutScreen} />
          <Route path="/session/live/:session_id" component={LiveSession} />
        </Router>
      </ApolloProviderWrapper>
    </PhoenixSocketProvider>
  );
}
