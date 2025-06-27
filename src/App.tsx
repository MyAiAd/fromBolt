import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Affiliates = lazy(() => import('./pages/Affiliates'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Performance = lazy(() => import('./pages/Performance'));
const Profile = lazy(() => import('./pages/Profile'));
const ReActionData = lazy(() => import('./pages/ReActionData'));
const MightyNetworksData = lazy(() => import('./pages/MightyNetworksData'));
const JennaZData = lazy(() => import('./pages/JennaZData'));
const AffiliatesDashboard = lazy(() => import('./pages/AffiliatesDashboard'));
const DataSyncManagement = lazy(() => import('./pages/DataSyncManagement'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const Team = lazy(() => import('./pages/Team'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Chat = lazy(() => import('./pages/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user, isAdmin, loading } = useAuth();
  
  console.log('App.tsx: Auth state - loading:', loading, 'user:', user?.email || 'none', 'isAdmin:', isAdmin);
  
  // Show loading screen while authentication state is being determined
  if (loading) {
    console.log('App.tsx: Auth still loading, showing loading screen');
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth Routes - accessible for password reset flow */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        
        {/* Protected Routes - only accessible when logged in */}
        <Route element={<AppLayout />}>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {isAdmin ? <Dashboard /> : <UserDashboard />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/affiliates" 
            element={
              <ProtectedRoute>
                <Affiliates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns" 
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/performance" 
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/goaffpro-data"
            element={<Navigate to="/reaction-data" replace />}
          />
          <Route
            path="/reaction-data"
            element={
              <ProtectedRoute>
                <ReActionData />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/mightynetworks-data" 
            element={
              <ProtectedRoute>
                <MightyNetworksData />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jennaz-data" 
            element={
              <ProtectedRoute>
                <JennaZData />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/affiliates-dashboard" 
            element={
              <ProtectedRoute>
                <AffiliatesDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-sync" 
            element={
              <ProtectedRoute>
                <DataSyncManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-guide" 
            element={
              <ProtectedRoute>
                <UserGuide />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;