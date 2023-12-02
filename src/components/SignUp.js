import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import axios from 'axios';

const SignUp = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/register', userData);
      console.log('User registered:', response.data);
      // Add logic for handling successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      // Add logic for handling registration error
    }
  };

  return (
    <Box my={8} textAlign="left">
      <form onSubmit={handleSubmit}>
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
        <Button width="full" mt={4} type="submit">
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUp;