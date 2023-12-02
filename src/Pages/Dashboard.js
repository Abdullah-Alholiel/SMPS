import React from 'react';
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

export default Dashboard;
