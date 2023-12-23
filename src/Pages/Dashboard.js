import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { FaParking, FaChartBar, FaUserCircle, FaRegRegistered } from 'react-icons/fa';

import Sidebar from '../components/Sidebar';
import SmartParkingDashboard from '../components/Dashboard';
import ParkingSlots from '../components/ParkingSlots';
import UserReservations from '../components/UserReservations';
import Profile from '../components/Profile';
import { useAuth } from '../hooks/useAuth';
import useResponsive from '../hooks/useResponsive'; // Import useResponsive hook

const DashboardLayout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { isDesktopOrLaptop } = useResponsive(); // Use the useResponsive hook
  const userRole = localStorage.getItem('userRole'); // Retrieve the user role from localStorage

  const links = [
    { path: '/dashboard', icon: FaChartBar, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { path: '/dashboard/profile', icon: FaUserCircle, label: 'Profile', onClick: () => navigate('/dashboard/profile') },
    // Conditionally render the Parking Slots link for admin users only
    userRole === 'admin' && { path: '/dashboard/parking-slots', icon: FaParking, label: 'Parking Slots', onClick: () => navigate('/dashboard/parking-slots') },
    { path: '/dashboard/reservations', icon: FaRegRegistered, label: 'Reservations', onClick: () => navigate('/dashboard/reservations') },
  ].filter(Boolean); // Filter out any falsy values (e.g., if userRole is not 'admin')


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
        {/* Add other nested routes as needed */}
      </Route>
    </Routes>
  );
};

export default Dashboard;
