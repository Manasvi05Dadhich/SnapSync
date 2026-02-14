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
          setUser(data);
        } else {
          window.location.href = `${API}/auth/google`;
        }
      })
      .catch(() => {
        setUser(null);
        setBackendError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    window.location.href = `${API}/auth/logout`;
  };

  const retryAuth = () => {
    setBackendError(false);
    setLoading(true);
    fetchMe()
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
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
