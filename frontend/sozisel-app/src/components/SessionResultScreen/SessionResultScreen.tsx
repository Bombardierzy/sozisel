import "./SessionResultScreen.scss";

import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import { ReactElement } from "react";
import SessionResultEvents from "./SessionResultEvents";
import SessionResultHeader from "./SessionResultHeader";
import SessionResultRecording from "./SessionResultRecording";
import SessionResultSummary from "./SessionResultSummary/SessionResultSummary";

export function SessionResultScreen(): ReactElement {
  const { id: sessionId } = useParams<{ id: string }>();

  const { url } = useRouteMatch();

  return (
    <div className="SessionResultScreen">
      <MainNavbar />
      <SessionResultHeader sessionId={sessionId} />
      <Switch>
        <Route
          exact
          path={url + "/summary"}
          render={() => <SessionResultSummary sessionId={sessionId} />}
        />
        <Route
          exact
          path={url + "/events"}
          render={() => <SessionResultEvents sessionId={sessionId} />}
        />
        <Route
          exact
          path={url + "/recording"}
          render={() => <SessionResultRecording sessionId={sessionId} />}
        />
        <Route>
          <Redirect to={url + "/summary"} />
        </Route>
      </Switch>
    </div>
  );
}
