import { Navigate } from 'react-router';

import { useAuth } from '@/contexts/AuthProvider';

import { Loader } from './Loader';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};