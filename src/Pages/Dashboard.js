import React, { useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import SmartParkingDashboard from '../components/Dashboard';
import { useDisclosure } from '@chakra-ui/react';
import { FaParking, FaChartBar, FaUserCircle, FaSignOutAlt, FaRegRegistered } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ParkingSlots from '../components/ParkingSlots';

const Dashboard = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();
  const auth = useAuth();


  const links = [
    { name: 'dashboard', icon: FaChartBar, label: 'Dashboard', onClick: () => setActivePage('dashboard') },
    { name: 'profile', icon: FaUserCircle, label: 'Profile', onClick: () => setActivePage('profile') },
    { name: 'ParkingSlots', icon: FaParking, label: 'Parking Slots', onClick: () => setActivePage('parking-slots') },
    { name: 'Reservation', icon: FaRegRegistered, label: 'Reservations', onClick: () => setActivePage('reservations') },
    { name: 'logout', icon: FaSignOutAlt, label: 'Logout', onClick: () => {
      auth.logout();
      navigate('/login');
    }},
  ]; 

  return (
    <Flex h="100vh">
      <Sidebar isOpen={isOpen} onToggle={onToggle} activePage={activePage} links={links} />
      
      <Box flex="10" p="5">
        <Heading as="h1" mb="4">Dashboard</Heading>
        {activePage === 'dashboard' && <SmartParkingDashboard />}
        {activePage === 'profile' && <Profile />}
        {activePage === 'parking-slots' && <ParkingSlots />}
      </Box>
    </Flex>
  );
};

export default Dashboard;








/*import React from 'react';
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import Sidebar from '../components/Sidebar';
import { FaParking, FaChartBar, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
//import ParkingSlots from '../components/ParkingSlots'; // This is a new component to create
import SmartParkingDashboard from '../components/Dashboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const auth  = useAuth();
  return (
    <Flex h="100vh">
      <Sidebar links={[
      { path: '/parking-slots', icon: FaParking, label: 'Parking Slots' },
      { path: '/dashboard', icon: FaChartBar, label: 'Dashboard' },
      { path: '/profile', icon: FaUserCircle, label: 'Profile' },
      { path: '/logout', icon: FaSignOutAlt, label: 'Logout' , onClick: () => {
        auth.logout();},
    } ]}/>
      <Box flex="1" p="4">
        <Text fontSize="2xl" mb="4">Dashboard</Text>
        <SmartParkingDashboard />
        <Button mt="4" colorScheme="teal">
          Refresh
        </Button>
      </Box>
    </Flex>
  );
}

export default Dashboard;*/
