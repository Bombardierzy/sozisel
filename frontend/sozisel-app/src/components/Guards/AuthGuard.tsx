import React, { ReactElement, useEffect } from "react";

import { Route } from "react-router-dom";
import { USER_TOKEN } from "../../common/consts";
import { useHistory } from "react-router";
import { useMeQuery } from "../../graphql";

interface AuthGuardProps {
  component?: React.ComponentType;
}

export default function AuthGuard({ component }: AuthGuardProps): ReactElement {
  const { error, loading } = useMeQuery();
  const history = useHistory();

  useEffect(() => {
    if (error && error.message === "unauthorized") {
      console.error(error);
      history.push("/login");
      localStorage.removeItem(USER_TOKEN);
    }
  }, [error, history]);

  if (loading || error) {
    return <></>;
  }
  return <Route component={component} />;
}
