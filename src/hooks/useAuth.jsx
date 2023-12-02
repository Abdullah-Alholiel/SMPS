// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/users/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const contextValue = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);