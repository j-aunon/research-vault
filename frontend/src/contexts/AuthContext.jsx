import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const { data } = await authService.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (payload) => {
    const { data } = await authService.login(payload);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshMe: loadMe }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
