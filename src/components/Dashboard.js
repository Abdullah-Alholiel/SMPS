import React, { useState, useEffect } from 'react';
import { VStack, Flex, HStack, Text, Button, Tag, Circle, useToast, useColorMode, Container } from '@chakra-ui/react';
import { Clock, MapPin, Car, Unlock, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

const SmartParkingDashboard = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const [parkingSlots, setParkingSlots] = useState([]);
    const userId = localStorage.getItem('user_id'); // Retrieve the current user's ID

    useEffect(() => {
        fetchParkingSlots();
    }, []);

    // Fetch parking slots from the server and update the state
// Dashboard.js
    const fetchParkingSlots = async () => {
        try {
            const response = await axios.get('http://localhost:3001/parkingSlots');
            const updatedSlots = response.data.map(slot => ({
                ...slot,
                reserved: slot.userId === userId ? true : false,
                reservationId: slot.reservationId // Now includes the reservation ID
            }));
            setParkingSlots(updatedSlots);
        } catch (error) {
            toast({
                title: 'Error fetching parking slots',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

// get reservation id from served for each user for specific parkign slot


// Handle click on the Reserve/Cancel button
const handleReserveClick = async (slot) => {
    if (slot.userId === userId ) {
        // Cancel reservation logic
        // Send a DELETE request to the server to cancel the reservatio
        try {
            await axios.delete(`https://fluffy-wasp-windbreaker.cyclic.app/reservations/${slot.reservationId}`, {
                data: {
                    userId: userId,
                    slotNumber: slot.slotNumber
                }
            });
            toast({
                title: "Reservation cancelled",
                description: "Your reservation has been cancelled",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            fetchParkingSlots(); // Refresh the slots
        } catch (error) {
            toast({
                title: 'Error cancelling reservation',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    } else {
        // Redirect to reservation form with slot number
        navigate(`/dashboard/reservations`, { state: { slotNumber: slot.slotNumber } });
    }
};

    // Helper function to determine button color
    const color = (light, dark) => (colorMode === "light" ? light : dark);

    return (
        <ChakraProvider>
            <Container maxW="container.xl" p={0} m={0}>
                <div className="dashboard-container">
                    <header className="dashboard-header">
                        <Flex alignItems="center" justifyContent="space-between" w="full" bg={color('white', 'gray.800')} color={color('black', 'white')}>
                            <VStack alignItems="start">
                                <HStack>
                                    <Text fontWeight="bold" color={color('black', 'white')}>Reservations</Text>
                                </HStack>
                                <HStack>
                                    <Clock className="text-xl" color={color('black', 'white')} />
                                    <Text color={color('black', 'white')}>{new Date().toLocaleTimeString()}</Text>
                                </HStack>
                            </VStack>
                            <MapPin className="text-3xl" color={color('black', 'white')} />
                        </Flex>
                    </header>
                    <aside className="dashboard-menu">
                        {parkingSlots.map((slot) => (
                            <Container maxW="container.xl" p={0} m={0} key={slot._id} className="dashboard-menu-item">
                                <Flex key={slot._id} justifyContent="space-between" alignItems="center" w="full" p={4} borderWidth="1px" borderColor={color('gray.200', 'gray.600')} borderRadius="md" mb={2} bg={color('white', 'gray.700')} color={color('black', 'white')}>
                                    <HStack>
                                        <Car className="text-2xl" color={color('black', 'white')} />
                                        <Text color={color('black', 'white')}>Parking Slot {slot.slotNumber}</Text>
                                    </HStack>
                                    <Button
                                        onClick={() => handleReserveClick(slot)}
                                        leftIcon={slot.reserved ? <Unlock color={color('black', 'white')}/> : <Lock color={color('black', 'white')}/> }
                                        colorScheme={slot.reserved ? "red" : "green"}
                                        size="sm"
                                    >
                                        {slot.reserved ? "Cancel" : "Reserve"}
                                    </Button>
                                    <Tag size="sm" colorScheme={slot.isAvailable ? "green" : "red"} borderRadius="full">
                                        <Circle className={`text-xs ${slot.isAvailable ? "" : "fill-current"}`} color={color('black', 'white')} />
                                        {slot.isAvailable ? "Available" : "Reserved"}
                                    </Tag>
                                </Flex>
                            </Container>
                        ))}
                    </aside>
                </div>
            </Container>
        </ChakraProvider>
    );
};

export default SmartParkingDashboard;
