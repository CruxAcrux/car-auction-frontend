import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;