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

  const initialized = useSelector(
    (state) => state.auth.initialized
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

  // Token hai lekin abhi tak loadMe() ka pehla attempt
  // complete nahi hua — user data load hone tak wait karo,
  // warna time se pehle redirect ho jayega.
  if (!initialized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-brand-900">
          Loading...
        </p>
      </div>
    );
  }

  // Admin route
  if (adminOnly) {
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