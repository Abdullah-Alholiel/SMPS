import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, FormLabel, Input, Button, useToast,
  Avatar, AvatarBadge, Card, CardBody, CardFooter, Stack, Heading, Text, Container
} from '@chakra-ui/react';
import axios from 'axios';

const Profile = () => {
  const toast = useToast();

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
  }, [toast]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://colorful-fox-hosiery.cyclic.app/users/updateUser', profileData);
      toast({ title: 'User profile updated', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: 'Profile update failed', description: error.response.data.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Get the first name's initial for the avatar
  const getInitials = (name) => {
    return name.split(' ')[0][0];
  }

  return (
    <Container maxW='md' center="flex-items-center">
      <Card maxW='md'>
        <CardBody>
          <Stack spacing={4}>
            {/* Avatar with badge indicating user status */}
            <Avatar name={getInitials(profileData.username || '')}>
              <AvatarBadge boxSize='1.25em' bg='green.500' />
            </Avatar>
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <FormControl isRequired mb={4}>
                <FormLabel>Username</FormLabel>
                <Input type="text" name="username" value={profileData.username} onChange={handleChange} />
              </FormControl>

              {/* Email */}
              <FormControl isRequired mb={4}>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" value={profileData.email} onChange={handleChange} />
              </FormControl>

              {/* Phone Number */}
              <FormControl mb={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} />
              </FormControl>

              {/* Password */}
              <FormControl mb={4}>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" placeholder="Enter new password" onChange={handleChange} />
              </FormControl>

              {/* Submit Button */}
              <Button type="submit" colorScheme="blue">Update Profile</Button>
            </form>
          </Stack>
        </CardBody>
        <CardFooter>
          <Text fontSize='sm'>You can update your profile information here.</Text>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default Profile;

