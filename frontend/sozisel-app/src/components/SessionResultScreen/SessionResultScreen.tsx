import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

import MainNavbar from "../MainNavbar/MainNavbar";
import { ReactElement } from "react";
import SessionResultEvents from "./SessionResultEvents";
import SessionResultHeader from "./SessionResultHeader";
import SessionResultRecording from "./SessionResultRecording";
import SessionResultSummary from "./SessionResultSummary";

export function SessionResultScreen(): ReactElement {
  const { id: sessionId } = useParams<{ id: string }>();

  const { url } = useRouteMatch();

  return (
    <div>
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
        <Route render={() => <SessionResultSummary sessionId={sessionId} />} />
      </Switch>
    </div>
  );
}
