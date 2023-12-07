import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { FaParking, FaChartBar, FaUserCircle, FaSignOutAlt, FaRegRegistered } from 'react-icons/fa';

import Sidebar from '../components/Sidebar';
import SmartParkingDashboard from '../components/Dashboard';
import ParkingSlots from '../components/ParkingSlots';
import ReservationForm from '../components/ReservationForm';
import Profile from '../components/Profile';
import { useAuth } from '../hooks/useAuth';
import {AuthComponent} from '../util/AuthComponent';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
if (auth) {
  auth.logout();
  navigate('/login');
}
  };

  const links = [
    { path: '/dashboard', icon: FaChartBar, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { path: '/dashboard/profile', icon: FaUserCircle, label: 'Profile', onClick: () => navigate('/dashboard/profile') },
    { path: '/dashboard/parking-slots', icon: FaParking, label: 'Parking Slots', onClick: () => navigate('/dashboard/parking-slots') },
    { path: '/dashboard/reservations', icon: FaRegRegistered, label: 'Reservations', onClick: () => navigate('/dashboard/reservations') },
    { path: '/logout', icon: FaSignOutAlt, label: 'Logout', onClick: handleLogout },
  ];

  return (
    <Flex h="100vh">
      <Sidebar links={links} />
      <Box flex="10" p="5">
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
        <Route path="reservations" element={<ReservationForm />} />
        {/* Add other nested routes as needed */}
      </Route>
    </Routes>
  );
};

export default Dashboard;
