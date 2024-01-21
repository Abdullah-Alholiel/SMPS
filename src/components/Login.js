import React, { useState, useRef } from 'react';
import {
  Box, Flex, FormControl, FormLabel, Input, Button, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import usePasswordReset from '../hooks/usePasswordReset';

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // State and methods for modal
  const initialRef = useRef();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [email, setEmail] = useState(''); // State for email input in reset password modal
  const navigate = useNavigate();
  const toast = useToast();
  const cookies = new Cookies();
  const handleForgotPassword = usePasswordReset();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
    // Handles the submit action for the login form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to the login endpoint
            const response = await axios.post('http://localhost:3001/api/users/login', credentials);

            if (response.data.token) {
                // Store token in cookies
                cookies.set('TOKEN', response.data.token, { path: '/' });
                cookies.set('userId', response.data.user._id, { path: '/' });
               cookies.set('userRole', response.data.user.role, { path: '/' });
               cookies.set('username' , response.data.user.username, { path: '/' });

                // Notify the user of successful login and redirect
                toast({ title: 'Login successful', status: 'success', duration: 3000, isClosable: true });
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                // Notify the user of invalid credentials
                toast({ title: 'Invalid credentials', status: 'error', duration: 3000, isClosable: true });
            }
        } catch (error) {
            // Notify the user of a login failure
            toast({ 
                title: 'Login failed', 
                description: error.response?.data?.message || 'An error occurred', 
                status: 'error', 
                duration: 3000, 
                isClosable: true 
            });
        }
    };


    
    // JSX for the login 
    return (
        <Flex align="center" justify="center" h="100vh" bg="blue.50">
          <Box
            w={['90%', '400px']}
            p={8}
            boxShadow="xl"
            borderRadius="lg"
            bg="white"
            textAlign="center"
          >
            <Box shadow="md" p={4} rounded="md">
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name="username" value={credentials.username} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" value={credentials.password} onChange={handleChange} />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full" mt={4}>Login</Button>
              </form>
            </Box>
            <Button
              mt={4}
              colorScheme="blue"
              width="full"
              onClick={onOpen}
            >
              Forgot Password?
            </Button>
          </Box>
      
          {/* Modal for Forgot Password */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Forgot Password</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input 
                    ref={initialRef} 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleForgotPassword}>
                  Send Reset Link
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      );      
};

export default Login;
