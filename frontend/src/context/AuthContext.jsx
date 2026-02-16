import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, API, setToken, clearToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    // After OAuth callback, token is in URL hash - store it and clean URL
    const hash = window.location.hash;
    if (hash.startsWith('#token=')) {
      const token = hash.slice(7);
      setToken(token);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    fetchMe()
      .then((data) => {
        setUser(data || null);
      })
      .catch(() => {
        setUser(null);
        setBackendError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${API}/auth/google`;
  };

  const logout = () => {
    clearToken();
    window.location.href = `${API}/auth/logout`;
  };

  const retryAuth = () => {
    setBackendError(false);
    setLoading(true);
    fetchMe()
      .then((data) => {
        setUser(data || null);
      })
      .catch(() => {
        setBackendError(true);
      })
      .finally(() => setLoading(false));
  };

  const isCalendarConnected = !!user?.refreshToken;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isCalendarConnected, backendError, retryAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
