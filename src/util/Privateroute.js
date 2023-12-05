import React from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function ProtectedRoute({ element: Component, ...rest }) {
  const token = cookies.get("TOKEN");
  return (
    <Route
      {...rest}
      element={
        token ? <Component {...rest} /> : <Navigate to="/" />
      }
    />
  );
}
