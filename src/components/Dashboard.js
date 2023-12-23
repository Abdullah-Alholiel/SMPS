import React, { useState, useEffect, useRef } from 'react';
import {
  VStack, Flex, HStack, Text, Button, Tag, Circle, useToast, useColorMode, Container,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, FormControl,
  FormLabel,
  Input,
  Select
} from '@chakra-ui/react';
import { Clock, MapPin, Car, Unlock, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

const SmartParkingDashboard = () => {
  // Hooks for managing state and side effects
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [parkingSlots, setParkingSlots] = useState([]);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const cancelRef = useRef();
  const userId = localStorage.getItem('user_id'); // Retrieve the current user's ID from local storage


  //reservation form state
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [reservation, setReservation] = useState({
    duration: "30",
    slotId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Effect hook to fetch parking slots on component mount
  useEffect(() => {
    fetchParkingSlots();
  }, []);
  const openReservationForm = (slot) => {
    setReservation((prevState) => ({ ...prevState, slotId: slot.slotNumber.toString() }));
    setIsReservationFormOpen(true);
  };
  // Function to handle input change for reservation form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevState) => ({ ...prevState, [name]: value }));
  };

  // Function to handle reservation form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (reservation.duration * 60000));

    try {
      const response = await axios.post(
        "https://smps-shu.onrender.com/reservations/createreservation",
        {
          userId: localStorage.getItem("user_id"),
          slotNumber: parseInt(reservation.slotId),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }
      );

      setMessage("Reservation created successfully");
      setIsReservationFormOpen(false);
      fetchParkingSlots(); // Refresh the slots after successful reservation
      // If there's a callback to handle reservation success, call it here
      // onReservationSuccess(response.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch parking slots from the server
  const fetchParkingSlots = async () => {
    try {
      const response = await axios.get('https://smps-shu.onrender.com/parkingSlots');
      const updatedSlots = response.data.map(slot => ({
        ...slot,
        reserved: slot.status === 'reserved',
        reservationId: slot.reservationId || null,
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

  // Function to check if the slot is reserved by the current user
  const isSlotReservedByCurrentUser = (slot) => slot.userId === userId;

  // Function to handle click on the Reserve/Cancel button
  const handleReserveClick = async (slot) => {
    if (slot.reserved && isSlotReservedByCurrentUser(slot)) {
      // Prompt for cancellation if the slot is reserved by the current user
      setSelectedSlot(slot);
      setIsCancelConfirmOpen(true);
    } else if (slot.reserved) {
      // Show a message if the slot is reserved by another user
      toast({
        title: "Slot unavailable",
        description: "This parking slot is reserved by another user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Navigate to the reservation form if the slot is not reserved
      //navigate(`/dashboard/reservations`, { state: { slotNumber: slot.slotNumber } });
      openReservationForm(slot);

    }
  };

  // Function to cancel a reservation
  const cancelReservation = async () => {
    try {
      await axios.delete(`https://smps-shu.onrender.com/reservations/${selectedSlot.reservationId}`, {
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
                    leftIcon={slot.reserved ? <Unlock color={color('black', 'white')} /> : <Lock color={color('black', 'white')} />}
                    colorScheme={slot.reserved ? (slot.userId === userId ? "red" : "gray") : "green"}
                    size="sm"
                    isDisabled={slot.reserved && slot.userId !== userId}
                  >
                    {slot.reserved ? (slot.userId === userId ? "Cancel" : "Unavailable") : "Reserve"}
                  </Button>
                  <Tag
                    size="sm"
                    colorScheme={
                      slot.currentDistance < slot.distanceThreshold
                        ? (slot.reservationId && slot.reservedBy ? "red" : "yellow")
                        : (slot.reservationId ? "orange" : "green")
                    }
                    borderRadius="full"
                  >
                    <Circle
                      className={`text-xs ${slot.currentDistance < slot.distanceThreshold ? "" : "fill-current"}`}
                      color={color('black', 'white')}
                    />
                    {slot.currentDistance < slot.distanceThreshold
                      ? (slot.reservationId && slot.reservedBy ? "Occupied" : "Unauthorized")
                      : (slot.reservationId ? "Reserved" : "Available")
                    }
                  </Tag>
                </Flex>
              </Container>
            ))}

          </aside>
        </div>

        <AlertDialog
          isOpen={isReservationFormOpen}
          onClose={() => setIsReservationFormOpen(false)}
          leastDestructiveRef={cancelRef}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Create Reservation
              </AlertDialogHeader>
              <AlertDialogBody>
                {message && <Text color="red.500">{message}</Text>}
                <FormControl isRequired mt={4}>
                  <FormLabel>Duration (minutes):</FormLabel>
                  <Select
                    name="duration"
                    value={reservation.duration}
                    onChange={handleChange}
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                  </Select>
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Slot ID:</FormLabel>
                  <Input
                    type="text"
                    name="slotId"
                    value={reservation.slotId}
                    onChange={handleChange}
                    disabled // The slot ID is set when opening the form
                  />
                </FormControl>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={() => setIsReservationFormOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit} isLoading={isSubmitting} ml={3}>
                  Reserve
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

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
