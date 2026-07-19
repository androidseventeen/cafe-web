import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ allow }) {
  const { status, user } = useAuth();

  if (status === 'loading') {
    // Avoid flashing a redirect before the mount-time /me call resolves.
    return null;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
