import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Basic frontend validation
  const isValid = () => {
    if (!userData.email.includes('@')) {
      toast({ title: 'Invalid email', status: 'error', duration: 3000, isClosable: true });
      return false;
    }
    if (userData.password !== userData.confirmPassword) {
      toast({ title: "Passwords don't match", status: 'error', duration: 3000, isClosable: true });
      return false;
    }
    // Add more validation logic as needed
    return true;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    if (!isValid()) return;
    try {
      const response = await axios.post('https://colorful-fox-hosiery.cyclic.app/users/register', userData);
      //save response in cookies
      cookies.set('User', response.data, { path: '/' });
      toast({ title: 'Registration successful', status: 'success', duration: 3000, isClosable: true });
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      toast({ title: 'Registration failed', description: error.response.data.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box my={8} textAlign="left">
      <form onSubmit={handleSubmit}>
        {/* Form fields with Chakra UI */}
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input type="text" name="phoneNumber" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" onChange={handleChange} />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" name="confirmPassword" onChange={handleChange} />
        </FormControl>
        <Button width="full" mt={4} type="submit" colorScheme="blue">
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUp;
