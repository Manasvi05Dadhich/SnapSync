import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, API } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        if (data) {
          // Successful login — clear the redirect flag
          sessionStorage.removeItem('snap_auth_attempted');
          setUser(data);
        } else if (!sessionStorage.getItem('snap_auth_attempted')) {
          // First attempt — redirect to Google auth
          sessionStorage.setItem('snap_auth_attempted', 'true');
          window.location.href = `${API}/auth/google`;
        } else {
          // Already tried redirecting and still no user — stop looping
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
        setBackendError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    sessionStorage.removeItem('snap_auth_attempted');
    window.location.href = `${API}/auth/logout`;
  };

  const retryAuth = () => {
    setBackendError(false);
    setLoading(true);
    sessionStorage.removeItem('snap_auth_attempted');
    fetchMe()
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
          sessionStorage.setItem('snap_auth_attempted', 'true');
          window.location.href = `${API}/auth/google`;
        }
      })
      .catch(() => {
        setBackendError(true);
      })
      .finally(() => setLoading(false));
  };

  const isCalendarConnected = !!user?.refreshToken;

  return (
    <AuthContext.Provider value={{ user, loading, logout, isCalendarConnected, backendError, retryAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
