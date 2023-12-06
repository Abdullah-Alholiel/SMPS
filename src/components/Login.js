import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cookies = new Cookies();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://spmsdissertation-abdullah-alholaiels-projects.vercel.app/users/login', credentials);
      if (response.data.token) {
        // Store token in cookies
        cookies.set('TOKEN', response.data.token, { path: '/' });
        toast({ title: 'Login successful', status: 'success', duration: 3000, isClosable: true });
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        toast({ title: 'Invalid credentials', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: 'Login failed', description: error.response.data.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" value={credentials.username} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={credentials.password} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={4}>Login</Button>
      </form>
    </Box>
  );
};

export default Login;
