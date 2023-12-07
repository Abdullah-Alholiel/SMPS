import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast, Flex } from '@chakra-ui/react';
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
            const response = await axios.post('https://fluffy-wasp-windbreaker.cyclic.app/users/login', credentials);
            if (response.data.token) {
                // Store token and user ID in cookies or localStorage
                cookies.set('TOKEN', response.data.token, { path: '/' });
                cookies.set('userId', response.data.user._id, { path: '/' });
                cookies.set('User', response.data.user, { path: '/dashboard' });
                //localStorage.setItem('user_id', response.data.user._id);// Another way of storing user ID in localStorage
                localStorage.user_id = response.data.user._id; // Storing user ID in localStorage
                //another way of storing user id

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
