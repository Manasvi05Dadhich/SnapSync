import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe } from '../lib/api';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
          window.location.href = `${API_BASE}/auth/google`;
          return;
        }
      })
      .catch(() => {
        window.location.href = `${API_BASE}/auth/google`;
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    window.location.href = `${API_BASE}/auth/logout`;
  };

  const isCalendarConnected = !!user?.refreshToken;

  return (
    <AuthContext.Provider value={{ user, loading, logout, isCalendarConnected }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
