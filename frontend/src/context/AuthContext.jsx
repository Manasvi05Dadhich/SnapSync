import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, setToken, clearToken, loginUser, registerUser } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    // Check for token in URL hash (from Google OAuth callback)
    const hash = window.location.hash;
    if (hash.includes('token=')) {
      const parts = hash.split('token=');
      if (parts[1]) {
        const token = parts[1].split('&')[0];
        setToken(token);
        window.location.hash = ''; // Clear hash
      }
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

  const isCalendarConnected = !!user?.refreshToken;

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, backendError, retryAuth, isCalendarConnected }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
