import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute: Auth state check - loading:', loading, 'user:', user?.email || 'none', 'location:', location.pathname);
  
  // Show loading screen while authentication state is being determined
  // This prevents premature redirects during session restoration
  if (loading) {
    console.log('ProtectedRoute: Still loading auth state, showing loading screen');
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    console.log('ProtectedRoute: No authenticated user, redirecting to login with return path:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 