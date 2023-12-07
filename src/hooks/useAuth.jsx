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
          const result = await axios.get('https://shy-frog-boot.cyclic.app/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ token });
          setMessage(result.data.message);
        }
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

  const logout = () => {
    cookies.remove('TOKEN', { path: '/' }); // Ensure path matches the one used in login
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
