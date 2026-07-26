import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthPayload = (responseData) => responseData?.data || responseData;

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(getAuthPayload(data));
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    const authPayload = getAuthPayload(data);
    localStorage.setItem('token', authPayload.token);
    setUser(authPayload);
  
    // Change this line to return data.data instead of just data
    return authPayload; 
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    const authPayload = getAuthPayload(data);
    localStorage.setItem('token', authPayload.token);
    setUser(authPayload);
    return authPayload;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};