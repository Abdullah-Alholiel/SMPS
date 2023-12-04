import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/users/profile');
        setProfileData(response.data);
      } catch (error) {
        toast({ title: 'Error fetching profile', status: 'error' });
      }
    };
    fetchProfile();
  }, [toast]); // Add 'toast' as a dependency to useEffect

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://shy-frog-boot.cyclic.app/users/register', profileData);
      toast({ title: 'User profile updated', status: 'success', duration: 3000, isClosable: true });
      navigate('/profile');
    } catch (error) {
      toast({ title: 'Profile update failed', description: error.response.data.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box p={4}>
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
        <Button type="submit" colorScheme="blue">Update Profile</Button>
      </form>
    </Box>
  );
};

export default Profile;