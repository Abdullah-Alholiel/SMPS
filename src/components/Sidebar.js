import React from 'react';
import { Box, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} p={4} width="20%">
      <VStack spacing={4} align="stretch">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            activeStyle={{ fontWeight: 'bold', color: 'red' }}
            style={{ color: linkColor }}
            onClick={link.onClick} // Add this line
          >
            <Icon as={link.icon} /> {link.label}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
}

export default Sidebar;