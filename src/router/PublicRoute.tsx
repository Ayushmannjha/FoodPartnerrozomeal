import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common/Loading';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/dashboard' }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
