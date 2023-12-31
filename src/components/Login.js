import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const cookies = new Cookies(); // Corrected the instantiation of Cookies
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    // Handles changes in the input fields
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Handles the submit action for the login form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to the login endpoint
            const response = await axios.post('https://smps-shu.onrender.com/api/users/login', credentials);

            if (response.data.token) {
                // Store token in cookies
                cookies.set('TOKEN', response.data.token, { path: '/' });
                cookies.set('userId', response.data.user._id, { path: '/' });
               cookies.set('userRole', response.data.user.role, { path: '/' });
               cookies.set('username' , response.data.user.username, { path: '/' });
                // Store user ID in localStorage (choose one method)
                localStorage.setItem('TOKEN', response.data.token);
                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('username' , response.data.user.username);
                if (response.data.user.role === 'admin') {
                    localStorage.setItem('userRole', response.data.user.role);
                }
                if (response.data.role === 'user') {
                 localStorage.setItem('userRole', response.data.role);
                }
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

    // JSX for the login form
    return (
        <Flex align="center" justify="center" h="100vh">
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
                    <Button type="submit" colorScheme="blue" mt={4}>Login</Button>
                </form>
            </Box>
        </Flex>
    );
};

export default Login;
