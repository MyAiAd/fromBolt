import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [searchParams] = useSearchParams();
  const { supabase } = useAuth();
  const navigate = useNavigate();

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    const setupSession = async () => {
      try {
        // Check if we already have a session (from server-side verification)
        console.log('ResetPassword: Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('ResetPassword: Session check result:', session ? 'session found' : 'no session', sessionError ? `error: ${sessionError.message}` : 'no error');
        
        if (session) {
          console.log('ResetPassword: Found existing session from server-side verification');
          console.log('ResetPassword: Session user:', session.user?.email);
          setSessionReady(true);
          return;
        }

        // Try different approaches for recovery token
        let success = false;

        // Handle different token formats
        if (token && type === 'recovery') {
          // Handle recovery token from email template
          console.log('ResetPassword: Verifying recovery token from URL, token length:', token.length);
          console.log('ResetPassword: Token preview:', token.substring(0, 20) + '...');
          
          // Method 1: Direct verifyOtp with token_hash
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });
            
            if (!error && data.session) {
              console.log('ResetPassword: Recovery token verified successfully with token_hash');
              setSessionReady(true);
              success = true;
            } else if (error) {
              console.log('ResetPassword: Method 1 failed:', error.message);
            }
          } catch (err) {
            console.log('ResetPassword: Method 1 exception:', err);
          }
          
          // Method 2: Try with exchangeCodeForSession (if Method 1 fails)
          if (!success) {
            try {
              console.log('ResetPassword: Trying exchangeCodeForSession method...');
              const { data, error } = await supabase.auth.exchangeCodeForSession(token);
              
              if (!error && data.session) {
                console.log('ResetPassword: Recovery token verified successfully with exchangeCodeForSession');
                setSessionReady(true);
                success = true;
              } else if (error) {
                console.log('ResetPassword: Method 2 failed:', error.message);
              }
            } catch (err) {
              console.log('ResetPassword: Method 2 exception:', err);
            }
          }
          
          // Method 3: Try treating as access token (if Methods 1&2 fail)
          if (!success) {
            try {
              console.log('ResetPassword: Trying as access token...');
              const { data, error } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: token,
              });
              
              if (!error && data.session) {
                console.log('ResetPassword: Token worked as access token');
                setSessionReady(true);
                success = true;
              } else if (error) {
                console.log('ResetPassword: Method 3 failed:', error.message);
              }
            } catch (err) {
              console.log('ResetPassword: Method 3 exception:', err);
            }
          }
          
          if (!success) {
            console.error('ResetPassword: All token verification methods failed');
          }
        } else if (accessToken && refreshToken) {
          // Handle access/refresh tokens
          console.log('ResetPassword: Setting session with access/refresh tokens from URL');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('ResetPassword: Session setup error:', error);
          } else {
            console.log('ResetPassword: Session established successfully', data.session ? 'with session' : 'without session');
            if (data.session) {
              setSessionReady(true);
            }
          }
        } else {
          console.log('ResetPassword: No valid tokens found in URL');
          
          // Check for URL fragments (Supabase might use these for server-side verification)
          const hash = window.location.hash;
          if (hash) {
            console.log('ResetPassword: Found URL hash, checking for tokens:', hash);
            const hashParams = new URLSearchParams(hash.substring(1));
            const hashAccessToken = hashParams.get('access_token');
            const hashRefreshToken = hashParams.get('refresh_token');
            
            if (hashAccessToken && hashRefreshToken) {
              console.log('ResetPassword: Found tokens in URL hash, setting session...');
              try {
                const { data, error } = await supabase.auth.setSession({
                  access_token: hashAccessToken,
                  refresh_token: hashRefreshToken,
                });
                
                if (!error && data.session) {
                  console.log('ResetPassword: Session established from URL hash');
                  setSessionReady(true);
                  success = true;
                } else if (error) {
                  console.log('ResetPassword: Hash token session failed:', error.message);
                }
              } catch (err) {
                console.log('ResetPassword: Hash token exception:', err);
              }
            }
          }
        }
      } catch (error) {
        console.error('ResetPassword: Exception during session setup:', error);
      }
    };

    // Always check for session, even without URL tokens (for server-side verification)
    setupSession();
  }, [accessToken, refreshToken, token, type, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if session is ready
    if (!sessionReady) {
      toast.error('Session not ready. Please wait a moment and try again.');
      setLoading(false);
      return;
    }

    // Validation
    if (!password) {
      toast.error('Please enter a new password');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Double-check session before updating
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. Please try clicking the reset link again.');
      }

      console.log('ResetPassword: Updating password with active session');
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully! You can now sign in with your new password.');
      
      // Sign out after password update to ensure clean state
      await supabase.auth.signOut();
      
      // Redirect to login
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only show error if we have no tokens AND no session is being established
  // (Allow time for server-side verification to establish session)
  if (!accessToken && !token && !sessionReady && !loading) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Request a new password reset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
              <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
          {!sessionReady && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-2">
              ⏳ Setting up secure session...
            </div>
          )}
          {sessionReady && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
              ✅ Session ready - you can now reset your password
            </div>
          )}
        </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm New Password
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : !sessionReady ? 'Setting up session...' : 'Update Password'}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      </form>
    </div>
  );
} 