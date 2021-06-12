import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

import AboutScreen from "./components/AboutScreen/AboutScreen";
import { ApolloProviderWrapper } from "./contexts/ApolloProviderWrapper";
import AuthGuard from "./components/Guards/AuthGuard";
import CreateSession from "./components/SessionDetails/CreateSession";
import EditSession from "./components/SessionDetails/EditSession/EditSession";
import JitsiShowcaseScreen from "./components/Jitsi/JitsiShowcaseScreen";
import JoinSession from "./components/JoinSession/JoinSession";
import Login from "./components/LoginScreen/LoginScreen";
import ParticipantGuard from "./components/Guards/ParticipantGuard";
import { PhoenixSocketProvider } from "./contexts/PhoenixSocketContext";
import { ReactElement } from "react";
import Register from "./components/RegisterScreen/RegisterScreen";
import SessionRecordingUpload from "./components/SessionRecordingUpload/SesisonRecordingUpload";
import { SessionResultScreen } from "./components/SessionResultScreen/SessionResultScreen";
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
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/about" component={AboutScreen} />
          {/* TODO remove JitsiShowcaseScreen component */}
          <Route exact path="/jitsi" component={JitsiShowcaseScreen} />
          <Route exact path="/home">
            <Redirect to="/templates" />
          </Route>
          <Route exact path ="/sessions/:id/result">
            <AuthGuard component={SessionResultScreen} />
          </Route>
          <Route exact path="/templates">
            <AuthGuard component={TemplateList} />
          </Route>
          <Route exact path="/templates/create">
            <AuthGuard component={TemplateCreation} />
          </Route>
          <Route exact path="/templates/:id/edit">
            <AuthGuard component={TemplateCreation} />
          </Route>
          <Route exact path="/sessions">
            <AuthGuard component={SessionsList} />
          </Route>
          <Route exact path="/sessions/create">
            <AuthGuard component={CreateSession} />
          </Route>
          <Route exact path="/sessions/:id/edit">
            <AuthGuard component={EditSession} />
          </Route>
          <Route exact path="/sessions/:id/recording/upload">
            <AuthGuard component={SessionRecordingUpload} />
          </Route>
          <Route path="/sessions/:id/join" component={JoinSession} />
          <Route exact path="/sessions/:id/live">
            <ParticipantGuard />
          </Route>
        </Router>
      </ApolloProviderWrapper>
    </PhoenixSocketProvider>
  );
}
