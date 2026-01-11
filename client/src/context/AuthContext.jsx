import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bookit_token'));
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('bookit_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (payload) => {
    setToken(payload.token);
    localStorage.setItem('bookit_token', payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bookit_token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refresh: loadMe,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
