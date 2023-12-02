import React from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <VStack spacing={4}>
      <Text fontSize="2xl">Welcome to Smart Parking System</Text>
      <Box>
        <Link to="/login">
          <Button colorScheme="teal">Login</Button>
        </Link>
        <Link to="/signup">
          <Button colorScheme="teal" ml={2}>Sign Up</Button>
        </Link>
      </Box>
    </VStack>
  );
};

export default HomePage;
