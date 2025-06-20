import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute: Auth state check - loading:', loading, 'user:', user?.email || 'none');
  
  // Show loading screen while authentication state is being determined
  if (loading) {
    console.log('ProtectedRoute: Still loading auth state, showing loading screen');
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: No authenticated user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 