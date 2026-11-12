import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentPathWithQuery } from '../../utils/authSession';
import React from 'react';
export function SignInRedirect() {
  const location = useLocation();
  return (
    <Navigate
      to="/signin"
      replace
      state={{ from: getCurrentPathWithQuery(location.pathname, location.search, location.hash) }}
    />
  );
}
