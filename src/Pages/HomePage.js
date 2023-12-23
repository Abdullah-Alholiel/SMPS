import React from 'react';
import { Box, Button, Text, VStack, Heading, Container, Divider, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {  FaGithub, FaRegLightbulb,  } from 'react-icons/fa'; // Import an icon more appropriate for research
import {  EmailIcon, LockIcon } from '@chakra-ui/icons';

const HomePage = () => {
  return (
    <Container maxW="container.xl" p={0}>
      <VStack spacing={10} py={10}>

        {/* Header Text Section */}
        <VStack spacing={4}>
          <Heading fontSize="4xl" textAlign="center">Smart Parking Management System</Heading>
          <Text fontSize="xl" textAlign="center">
            Park smarter and faster with our innovative solution.
          </Text>
        </VStack>

        <Divider />

        {/* Welcome Section */}
        <Center py={0}>
          <VStack spacing={5} maxW="lg" alignItems="center" textAlign="center">
            <Box>
              <Heading leftIcon={<FaRegLightbulb />} fontSize="3xl">Welcome to the Future of Parking</Heading>
              <Text mt={4} fontSize="lg" color="gray.600">
                Discover the easiest way to find and reserve a parking spot in just a few clicks.
              </Text>
            </Box>
            <VStack spacing={4} mt={5}>
              <Link to="/login" style={{ width: '100%' }}>
                <Button leftIcon={<LockIcon />} colorScheme="teal" w="full">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" style={{ width: '100%' }}>
                <Button leftIcon={<EmailIcon />} colorScheme="teal" w="full">
                  Sign Up 
                </Button>
              </Link>
            </VStack>
          </VStack>
        </Center>

        <Divider />

        {/* Research and Development Section */}
        <VStack spacing={-1} my={0} maxW="lg" alignItems="center" textAlign="center">
          <Heading fontSize="2xl">Research and Development</Heading>
          <Text fontSize="md" color="gray.600">
            Explore our cutting-edge research and contributions to smart parking technology.
          </Text>
          <VStack spacing={4} mt={5} maxW="lg" alignItems="center" textAlign="center">
          <Link to="/research" >
            <Button leftIcon={<FaRegLightbulb />} colorScheme="gray" w="full">
              Our Research
            </Button>
          </Link>
          <Link to="https://github.com/Abdullah-Alholiel/SMPS" >
            <Button leftIcon={<FaGithub />} colorScheme="gray" w="full">
              Gitub Repo
            </Button>
          </Link>
          </VStack>
        </VStack>

        {/* Additional sections could be added here */}
        {/* Footer could be added here */}
      </VStack>
    </Container>
  );
};

export default HomePage;