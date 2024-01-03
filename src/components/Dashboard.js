import React, { useState, useEffect, useRef } from "react";
import {
  VStack,
  Flex,
  HStack,
  Text,
  Button,
  Tag,
  Circle,
  useToast,
  useColorMode,
  Container,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Clock, MapPin, Car, Unlock, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Cookies from "universal-cookie";

const SmartParkingDashboard = () => {
  // Hooks for managing state and side effects
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [parkingSlots, setParkingSlots] = useState([]);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const cancelRef = useRef();
  const cookies = new Cookies();
  const userId = localStorage.getItem("userId") 
  
  if (!userId) {
    userId = cookies.get("userId");
    if (!userId) {
      throw new Error("User ID not found");
    }
  }

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
    setReservation((prevState) => ({
      ...prevState,
      slotId: slot.slotNumber.toString(),
    }));
    setIsReservationFormOpen(true);
  };
  // Function to handle input change for reservation form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevState) => ({ ...prevState, [name]: value }));
  };

  // Function to handle reservation form submission
  // Function to handle reservation form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCancelDisabled(true); // Disable the cancel button while the reservation is being created

    let userId;
    try {
      userId = localStorage.getItem("userId");
      if (!userId) {
        const cookies = new Cookies();
        userId = cookies.get("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }
      }
      const response = await axios.post(
        "https://smps-shu.onrender.com/api/reservations/createreservation",
        {
          userId: userId,
          slotNumber: parseInt(reservation.slotId),
          duration: parseInt(reservation.duration), // Include duration in the request
        }
      );

      setMessage("Reservation created successfully");
      setIsReservationFormOpen(false);
      fetchParkingSlots(); // Refresh the slots after successful reservation
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setCancelDisabled(false); // Enable the cancel button after the reservation is created or an error occurs
    }
  };
  // Function to fetch parking slots from the server
  const fetchParkingSlots = async () => {
    try {
      const response = await axios.get(
        "https://smps-shu.onrender.com/api/parkingSlots"
      );
      const updatedSlots = response.data.map((slot) => ({
        ...slot,
        reserved: slot.status === "reserved",
        reservationId: slot.reservationId || null,
        userId: slot.userId ? slot.userId._id : null,
      }));
      const currentReservation = updatedSlots.find(
        (slot) => slot.reservationId === selectedSlot?.reservationId
      );
      setParkingSlots(updatedSlots);
      if (currentReservation) {
        setSelectedSlot(currentReservation);
      } else {
        setSelectedSlot(null); // Add this line to reset the selectedSlot if it's no longer reserved
      }
    } catch (error) {
      toast({
        title: "Error fetching parking slots",
        description: error.message,
        status: "error",
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
      // Slot is reserved by the current user, show cancel option
      setSelectedSlot(slot);
      setIsCancelConfirmOpen(true);
    } else if (!slot.reserved) {
      // Slot is not reserved, show reserve option
      openReservationForm(slot);
    } else {
      // Slot is reserved by another user, show unavailable
      toast({
        title: "Slot unavailable",
        description: "This parking slot is reserved by another user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to cancel a reservation
  const cancelReservation = async () => {
    try {
      await axios.delete(
        `https://smps-shu.onrender.com/api/reservations/${selectedSlot.reservationId}`,
        {
          data: {
            userId: userId,
            slotNumber: selectedSlot.slotNumber,
          },
        }
      );
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard/reservations");
      fetchParkingSlots(); // Refresh the slots after cancellation
    } catch (error) {
      toast({
        title: "Error cancelling reservation",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsCancelConfirmOpen(false); // Close the confirmation dialog
      setCancelDisabled(false); // Enable the cancel button after the reservation is cancelled
    }
  };
  // Helper function to determine button color
  const color = (light, dark) => (colorMode === "light" ? light : dark);

  return (
    <ChakraProvider>
      <Container maxW="container.xl" p={0} m={0}>
        <div className="dashboard-container">
          <header className="dashboard-header">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              w="full"
              bg={color("white", "gray.800")}
              color={color("black", "white")}
            >
              <VStack spacing={2} alignItems="start">
                <Text fontWeight="bold" color={color("black", "white")}>
                  Parking Slots Dashboard
                </Text>
                <Text color={color("black", "white")}>
                  Please redirect to reservations if you couldn’t cancel from
                  the dashboard.
                </Text>
                <HStack>
                  <Clock className="text-xl" color={color("black", "white")} />
                  <Text color={color("black", "white")}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </HStack>
              </VStack>
              <MapPin className="text-3xl" color={color("black", "white")} />
            </Flex>
          </header>
          <aside className="dashboard-menu">
            {parkingSlots.map((slot) => (
              <Container
                maxW="container.xl"
                p={0}
                m={0}
                key={slot._id}
                className="dashboard-menu-item"
              >
                <Flex
                  key={slot._id}
                  justifyContent="space-between"
                  alignItems="center"
                  w="full"
                  p={4}
                  borderWidth="1px"
                  borderColor={color("gray.200", "gray.600")}
                  borderRadius="md"
                  mb={2}
                  bg={color("white", "gray.700")}
                  color={color("black", "white")}
                >
                  <HStack>
                    <Car className="text-2xl" color={color("black", "white")} />
                    <Text color={color("black", "white")}>
                      Parking Slot {slot.slotNumber}
                    </Text>
                  </HStack>
                  <Button
                    onClick={() => handleReserveClick(slot)}
                    leftIcon={
                      slot.reserved ? (
                        <Unlock color={color("black", "white")} />
                      ) : (
                        <Lock color={color("black", "white")} />
                      )
                    }
                    colorScheme={
                      slot.reservedBy
                        ? slot.userId === userId
                          ? "red"
                          : "gray"
                        : "green"
                    }
                    size="sm"
                    isDisabled={slot.reservedBy && slot.userId !== userId}
                  >
                    {slot.reservedBy
                      ? slot.userId === userId
                        ? "Cancel"
                        : "Unavailable"
                      : "Reserve"}
                  </Button>
                  <Tag
                    size="sm"
                    colorScheme={
                      slot.currentDistance < slot.distanceThreshold
                        ? slot.reservationId && slot.reservedBy
                          ? "red"
                          : "yellow"
                        : slot.reservationId
                        ? "orange"
                        : "green"
                    }
                    borderRadius="full"
                  >
                    <Circle
                      className={`text-xs ${
                        slot.currentDistance < slot.distanceThreshold
                          ? ""
                          : "fill-current"
                      }`}
                      color={color("black", "white")}
                    />
                    {slot.currentDistance < slot.distanceThreshold
                      ? slot.reservationId && slot.reservedBy
                        ? "Occupied"
                        : "Unauthorized"
                      : slot.reservationId
                      ? "Reserved"
                      : "Available"}
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
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  ml={3}
                >
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
                Are you sure you want to cancel your reservation for slot{" "}
                {selectedSlot?.slotNumber}?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsCancelConfirmOpen(false)}
                >
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
