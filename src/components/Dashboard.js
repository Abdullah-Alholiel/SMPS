import React, { useState, useEffect } from 'react';
import {
    VStack, Flex, HStack, Text, Button, Tag, Circle, useToast, useColorMode, Container,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
  } from '@chakra-ui/react';import { Clock, MapPin, Car, Unlock, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useRef } from 'react';

const backendURL = process.env.backendURL;

const SmartParkingDashboard = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const [parkingSlots, setParkingSlots] = useState([]);

    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const cancelRef = useRef();

    const userId = localStorage.getItem('user_id'); // Retrieve the current user's ID

    useEffect(() => {
        fetchParkingSlots();
    }, []);

    // Fetch parking slots from the server and update the state

const fetchParkingSlots = async () => {
    try {
        const response = await axios.get('https://colorful-fox-hosiery.cyclic.app/parkingSlots');
        const updatedSlots = response.data.map(slot => ({
            ...slot,
            reserved: slot.status === 'reserved',
            reservationId: slot.reservationId ? slot.reservationId : null,
            // Add the userId to the slot data
            userId: slot.userId ? slot.userId._id : null
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
    // Function to check if the slot is reserved by the current user
    const isSlotReservedByCurrentUser = (slot) => {
        return slot.reservedBy === userId;
    };
console.log(isSlotReservedByCurrentUser);
 // Handle click on the Reserve/Cancel button
 const handleReserveClick = async (slot) => {
    if (!isSlotReservedByCurrentUser(slot))  {
      // If the slot is reserved by another user, show a message
      toast({
        title: "Slot unavailable",
        description: "This parking slot is reserved by another user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (slot.reserved && slot.userId === userId) {
      // If the slot is reserved by the current user, prompt for cancellation
      setSelectedSlot(slot);
      setIsCancelConfirmOpen(true);
    } else {
      // If the slot is not reserved, navigate to the reservation form
      navigate(`/dashboard/reservations`, { state: { slotNumber: slot.slotNumber } });
    }
  };

  // Function to cancel a reservation
  const cancelReservation = async () => {
    try {
      await axios.delete(`https://colorful-fox-hosiery.cyclic.app/reservations/${selectedSlot.reservationId}`, {
        data: {
          userId: userId,
          slotNumber: selectedSlot.slotNumber
        }
      });
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchParkingSlots(); // Refresh the slots after cancellation
    } catch (error) {
      toast({
        title: 'Error cancelling reservation',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsCancelConfirmOpen(false); // Close the confirmation dialog
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
                                        colorScheme={slot.reserved ? (slot.userId === userId ? "red" : "gray") : "green"}
                                        size="sm"
                                        isDisabled={slot.reserved && slot.userId !== userId}
                                    >
                                         {slot.reserved ? (slot.userId === userId ? "Cancel" : "Unavailable") : "Reserve"}
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
                <AlertDialog
        isOpen={isCancelConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsCancelConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Reservation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel your reservation for slot {selectedSlot?.slotNumber}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsCancelConfirmOpen(false)}>
                No
              </Button>
              <Button colorScheme="red" onClick={cancelReservation} ml={3}>
                Yes, Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
            </Container>
        </ChakraProvider>
    );
};

export default SmartParkingDashboard;
