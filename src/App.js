import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Define a component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  // Retrieve the authentication token from cookies
  const token = cookies.get("TOKEN");
  // If a token exists, render the child components (allow access to the route)
  // Otherwise, redirect the user to the login page
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
