import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, FormLabel, Input, Button, useToast,
  Avatar, AvatarBadge, Container
} from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const toast = useToast();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let userId = localStorage.getItem('user._id');
        if (!userId) {
          const cookies = new Cookies();
          userId = cookies.get('userId');
          if (!userId) {
            throw new Error('User ID not found');
          }
        }
        const response = await axios.get(`https://smps-shu.onrender.com/api/profile/${userId}`, {
          withCredentials: true
        });
        setProfileData(response.data); // Set profile data in state
      } catch (error) {
        toast({ title: 'Error fetching profile', description: error.message, status: 'error' });
      }
    };
    fetchProfile();
  }, [toast]);
  // Handle input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle profile update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Fetch token from local storage
      await axios.post('https://smps-shu.onrender.com/api/users/updateUser', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'User profile updated', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: 'Profile update failed', description: error.response.data.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  const navigate = useNavigate(); // Add this line
// Handles password reset request
  const handlePasswordResetRequest = async () => {
    try {
        const response = await axios.post('https://smps-shu.onrender.com/api/users/requestPasswordReset', { email: profileData.email });
        toast({ title: response.data.message, status: 'success' });
        navigate('/reset-password');
    } catch (error) {
        toast({ title: 'Failed to send password reset email', description: error.response.data.error, status: 'error' });
    }
};


  // Get the first name's initial for the avatar
  const getInitials = (name) => {
    return name ? name.split(' ')[0][0] : '';
  }

  return (
    <Container maxW='md' center="flex-items-center">
      <Box maxW='md' p="4" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Avatar name={getInitials(profileData.username)} mt="4">
          <AvatarBadge boxSize='1.25em' bg='green.500' />
        </Avatar>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel>Username</FormLabel>
            <Input type="text" name="username" value={profileData.username} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={profileData.email} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" placeholder="Enter new password" onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt="4">Update Profile</Button>
        </form>
        <Button onClick={handlePasswordResetRequest}>Forgot Password?</Button>
      </Box>
    </Container>
  );
};

export default Profile;
