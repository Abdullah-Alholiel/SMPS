// src/hooks/useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.get('TOKEN');
        if (token) {
          setUser({ token });
        }

        const result = await axios.get('https://shy-frog-boot.cyclic.app/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(result.data.message);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);

  const login = (userData) => {
    cookies.set('TOKEN', userData.token, { path: '/' });
    setUser(userData);
  };

  const logout = (userData) => {
    cookies.remove('TOKEN', { path: '/dashboard' });
    setUser(userData.TOKEN =0);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);