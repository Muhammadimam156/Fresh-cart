import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const location = useLocation();

  const token = useSelector(
    (state) => state.auth.token
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  // --------------------------------------------------
  // User is not logged in
  // --------------------------------------------------

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // --------------------------------------------------
  // Admin-only route
  // --------------------------------------------------

  if (
    adminOnly &&
    user?.role !== 'admin'
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}