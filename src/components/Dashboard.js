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

    useEffect(() => {
        const fetchParkingSlots = async () => {
            try {
                const response = await axios.get('https://fluffy-wasp-windbreaker.cyclic.app/parkingSlots');
                setParkingSlots(response.data);
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
        fetchParkingSlots();
    }, []);

    const handleReserveClick = (slot) => {
        if (slot.reserved) {
            // Cancel reservation logic
            axios.delete(`https://fluffy-wasp-windbreaker.cyclic.app/endreservation/${slot._id}`)
                .then(() => {
                    const updatedSlots = parkingSlots.map(s => 
                        s._id === slot._id ? { ...s, reserved: false } : s);
                    setParkingSlots(updatedSlots);
                    toast({
                        title: "Reservation cancelled",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                }).catch(error => {
                    toast({
                        title: 'Error cancelling reservation',
                        description: error.message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                });
        } else {
            // Proceed to reservation form
            navigate(`/dashboard/reservations`, { state: { slotNumber: slot.slotNumber } });
        }
    };

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