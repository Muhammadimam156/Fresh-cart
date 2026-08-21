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

  // Login nahi hai
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Admin route
  if (adminOnly) {
    console.log('ADMIN ROUTE CHECK');
    console.log('Token:', !!token);
    console.log('User:', user);
    console.log('User role:', user?.role);

    if (user?.role !== 'admin') {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return children;
}