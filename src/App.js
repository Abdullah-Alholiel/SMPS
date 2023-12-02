import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
//import PrivateRoute from './util/Privatroute.js';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/logout" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                
                  <Dashboard />
                
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
