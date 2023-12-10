import React, { useState } from 'react';
import { Box, VStack, IconButton, useColorModeValue, Flex, Text, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ activePage, links }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  
  const onToggle = () => setIsOpen(!isOpen);

  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const activeLinkColor = useColorModeValue('blue.500', 'blue.300');
  const sidebarWidth = isOpen ? '180px' : '50px';

  const handleLogout = async () => {
    try {
      //get Token from cookies
      const token = localStorage.getItem('token');
      navigate("/login");

      await axios.post('https://fluffy-wasp-windbreaker.cyclic.app/users/logout' , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Redirect to login page after successful logout

    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error (show error message, etc.)
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