import React from 'react';
import { Navigate } from 'react-router-dom';
import  auth  from '../services/authService'; // You need to create this hook based on your auth logic

const PrivateRoute = ({ children }) => {
  const { user } = auth(); // The useAuth hook should return the user's authentication status
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
