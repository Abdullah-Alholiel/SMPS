import React, { useState } from 'react';
import { Box, VStack, IconButton, useColorModeValue, Flex, Text, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Sidebar = ({ activePage, links }) => {
  const [isOpen, setIsOpen] = useState(true); // State to control sidebar open/close
  const onToggle = () => setIsOpen(!isOpen); // Function to toggle sidebar

  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const activeLinkColor = useColorModeValue('blue.500', 'blue.300');
  const sidebarWidth = isOpen ? '180px' : '50px'; // Adjust the width here as needed

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
      </VStack>
    </Box>
  );
};

export default Sidebar;
