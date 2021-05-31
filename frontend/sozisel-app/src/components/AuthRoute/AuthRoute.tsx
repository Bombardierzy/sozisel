import React, { ReactElement, useEffect } from "react";
import { Route, useHistory } from "react-router";

import { useMeQuery } from "../../graphql";

interface AuthRouteProps {
  component?: React.ComponentType;
  path: string;
  exact?: boolean;
}

export default function AuthRoute({
  component,
  path,
  exact = true,
}: AuthRouteProps): ReactElement {
  const { error, loading } = useMeQuery();
  const history = useHistory();

  useEffect(() => {
    if (error && error.message === "unauthorized") {
      console.error(error);
      history.push("/login");
      localStorage.removeItem("token");
    }
  }, [error, history]);

  if (loading || error) {
    return <></>;
  }
  return <Route exact={exact} path={path} component={component} />;
}
