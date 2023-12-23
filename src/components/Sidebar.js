import React, { useState } from 'react';
import { Box, VStack, IconButton, useColorModeValue, Flex, Text, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'universal-cookie';

const Sidebar = ({ activePage, links }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  
  const onToggle = () => setIsOpen(!isOpen);

  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const activeLinkColor = useColorModeValue('blue.500', 'blue.300');
  const sidebarWidth = isOpen ? '180px' : '50px';

  const handleLogout = async () => {
    try {
      const cookies = new Cookies();
      const token = cookies.get('TOKEN');
      // localStorage.getItem('TOKEN');
      if (!token) {
        throw new Error('No token found');
      }
      if (!auth) {
        // Redirect to login page if auth is null
        navigate('/login');
        return;
      }
      const user = await auth.getUser();
      if (!user.role.includes('admin')) {
        // Redirect to login page if user is not an admin
        navigate('/login');
        return;
      }
      await axios.post('https://smps-shu.onrender.com/users/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      cookies.remove('TOKEN');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <Box width={sidebarWidth} bg={useColorModeValue('gray.100', 'gray.900')} p={1} transition="width 0.2s">
      <IconButton
        icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        onClick={onToggle}
        variant="outline"
        aria-label="Toggle Sidebar"
        mb={4}
      />
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