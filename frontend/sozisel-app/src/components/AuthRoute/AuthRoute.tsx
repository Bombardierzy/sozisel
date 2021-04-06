import React, { ReactElement, useEffect } from "react";
import { Route, useHistory } from "react-router";

import { useMeQuery } from "../../graphql";

interface AuthRouteProps {
  component?: React.ComponentType;
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
      console.error(error);
      history.push("/login");
      localStorage.removeItem("token");
    }
  }, [error, history]);

  if (!loading) {
    return <Route exact path={path} component={component} />;
  } else {
    return <></>;
  }
}
