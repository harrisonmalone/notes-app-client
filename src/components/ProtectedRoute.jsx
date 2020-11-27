import React, { useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuthStatus } from "../utils/getAuthStatus";

const ProtectedRoute = (props) => {
  const { auth, loading, setAuth } = useContext(AuthContext);

  useEffect(() => {
    getAuthStatus(loading, setAuth);
  }, [setAuth, loading]);

  if (!loading && !auth) {
    return <Redirect to="/posts" />;
  } else {
    return (
      !loading && (
        <Route
          exact={props.exact}
          path={props.path}
          component={props.component}
        />
      )
    );
  }
};

export default ProtectedRoute;
