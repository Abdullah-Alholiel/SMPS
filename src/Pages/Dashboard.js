import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { FaHome, FaUser, FaCar, FaCalendarAlt, FaMicrochip, FaSignOutAlt } from "react-icons/fa";

import Sidebar from '../components/Sidebar';
import SmartParkingDashboard from '../components/Dashboard';
import ParkingSlots from '../components/ParkingSlots';
import UserReservations from '../components/UserReservations';
import Profile from '../components/Profile';
import IoTEmulator from '../components/IoTEmulator';
import { useAuth } from '../hooks/useAuth';
import useResponsive from '../hooks/useResponsive'; // Import useResponsive hook


const DashboardLayout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { isDesktopOrLaptop } = useResponsive(); // Use the useResponsive hook
  const userRole = localStorage.getItem('userRole'); // Retrieve the user role from localStorage

  const links = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { path: '/dashboard/profile', icon: FaUser, label: 'Profile', onClick: () => navigate('/dashboard/profile') },
    // Conditionally render the Parking Slots link for admin users only
    userRole === 'admin' && { path: '/dashboard/parking-slots', icon: FaCar, label: 'Parking Slots', onClick: () => navigate('/dashboard/parking-slots') },
    { path: '/dashboard/reservations', icon: FaCalendarAlt, label: 'Reservations', onClick: () => navigate('/dashboard/reservations') }, 
    { path: '/dashboard/IoTEmulator', icon: FaMicrochip, label: 'IoT Emulator', onClick: () => navigate('/dashboard/IoTEmulator') }].filter(Boolean); // Filter out any falsy values (e.g., if userRole is not 'admin')


  // The sidebar is always included but its visibility can be toggled on mobile devices
  return (
    <Flex h="100vh">
      <Sidebar links={links} activePage={window.location.pathname} isDesktopOrLaptop={isDesktopOrLaptop} />
      <Box flex="1" p="5">
        <Heading as="h1" mb="4">SPMS Dashboard</Heading>
        <Outlet />
      </Box>
    </Flex>
  );
};

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<SmartParkingDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="parking-slots" element={<ParkingSlots />} />
        <Route path="reservations" element={<UserReservations />} />
        <Route path="IoTEmulator" element={<IoTEmulator />} />
        {/* Add other nested routes as needed */}
      </Route>
    </Routes>
  );
};

export default Dashboard;
