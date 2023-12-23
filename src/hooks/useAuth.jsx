import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {

      navigate("/login");
      // Check if the user is already logged in
      try {
        const token = cookies.get('TOKEN');
        
        if (token) {
          const result = await axios.post('https://smps-shu.onrender.com/users/logout', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(result.data.message);
          setUser({ token });
          setMessage(result.data.message);
        }
      } catch (error) {
        // Handle error
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const login = (userData) => {
    cookies.set('TOKEN', userData.token, { path: '/' });
    setUser(userData);
  };

  const logout = () => {
    cookies.remove('TOKEN'); // Ensure path matches the one used in login
    setUser(null); // Clear user state
  
    // Set a timeout to navigate, to ensure all states are updated properly
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
