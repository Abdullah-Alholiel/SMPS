import React, { useState, useEffect } from 'react';
import { Box, VStack, IconButton, useColorModeValue, Flex, Text, Button, Center } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'universal-cookie';

const Sidebar = ({ activePage, links }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  
  useEffect(() => {
    const cookies = new Cookies();
    setUsername(cookies.get('username'));
  }, []);

  const onToggle = () => setIsOpen(!isOpen);
  const sidebarBgColor = useColorModeValue('gray.100', 'gray.900');
  const sidebarWidth = isOpen ? '180px' : '50px';
  const usernameBgColor = useColorModeValue('gray.200', 'gray.700'); // Subtle background for the username section
  const textColor = useColorModeValue('gray.600', 'white');
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const activeLinkColor = useColorModeValue('blue.500', 'blue.300');


  const handleLogout = async () => {
    try {
      const cookies = new Cookies();
      const token = cookies.get('TOKEN');
      
      navigate('/');

      if (!token) {
        throw new Error('No token found');
      }
  
      await axios.post('http://localhost:3001/api/users/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Clear cookies and local storage

      cookies.remove('TOKEN');
      cookies.remove('userId');
      cookies.remove('userRole');
  


      // Navigate to login or home page


        auth.setUser(null);

  
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  

  return (
    <Box min-height="100vh" width={sidebarWidth} bg={sidebarBgColor} p={1} transition="width 0.2s">
      <IconButton
        icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        onClick={onToggle}
        variant="outline"
        aria-label="Toggle Sidebar"
        mb={4}
      />
      <Center bg={usernameBgColor} py={2} px={isOpen ? 4 : 2} mb={4}>
        <Text fontSize="md" fontWeight="bold" fontStyle="italic" color={textColor} isTruncated>
           Hey, {username} 
        </Text> 
      </Center>
      <VStack spacing={4} align="stretch">
        {links.map((link, index) => (
          <Button 
            key={index} 
            onClick={link.onClick}
            colorScheme="teal" 
            variant="ghost" 
            justifyContent="start"
            style={{ color: activePage === link.name ? activeLinkColor : linkColor }}
          >
            <Flex align="center">
              <Box as={link.icon} mr={isOpen ? 2 : 0} />
              {isOpen && <Text>{link.label}</Text>}
            </Flex>
          </Button>
        ))}
        <Button onClick={handleLogout} colorScheme="red" variant="ghost" justifyContent="start">
          <Flex align="center">
            <Box as={SettingsIcon} mr={isOpen ? 2 : 0} />
            {isOpen && <Text>Logout</Text>}
          </Flex>
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;