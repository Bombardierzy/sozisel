import React, { ReactElement, useEffect } from "react";
import { Route, useHistory } from "react-router";

import { useMeQuery } from "../../graphql";

interface AuthRouteProps {
  component: React.ComponentType<unknown> | undefined;
  path: string;
}

export default function AuthRoute({
  component,
  path,
}: AuthRouteProps): ReactElement {
  const { error, loading } = useMeQuery();
  const history = useHistory();

  useEffect(() => {
    if (error && error.message === "unauthorized") {
      console.log(error);
      history.push("/login");
      localStorage.removeItem("token");
    }
  }, [error, history]);

  return <> {!loading && <Route exact path={path} component={component} />} </>;
}
