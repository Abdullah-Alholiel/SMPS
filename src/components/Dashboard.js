import React, { useState } from "react";
import {
  VStack, Flex, HStack, Text, Button, Tag, Circle, ChakraProvider, useToast, useColorMode, Container
} from "@chakra-ui/react";
import { Clock, MapPin, Car, Unlock, Lock } from "lucide-react";

const SmartParkingDashboard = () => {
  const toast = useToast();
  const { colorMode } = useColorMode(); // Hook to access the current color mode
  
  const [parkingSlots, setParkingSlots] = useState([
    // Initial state with mock data
    { id: 1, reserved: false },
    { id: 2, reserved: false },
    { id: 3, reserved: false },
  ]);

  // Function to toggle reservation status
  const toggleReservation = (slotId) => {
    const updatedSlots = parkingSlots.map((slot) =>
      slot.id === slotId ? { ...slot, reserved: !slot.reserved } : slot
    );
    setParkingSlots(updatedSlots);

    // Display toast notification on status change
    toast({
      title: `Parking Slot ${slotId}`,
      description: updatedSlots[slotId - 1].reserved
        ? "Reservation confirmed."
        : "Reservation cancelled.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Define a function to get color based on color mode
  const color = (light, dark) => (colorMode === "light" ? light : dark);
   return (
     <ChakraProvider>
      <Container maxW="container.xl" p={0} m={0}>
      <div className="dashboard-container">
        <header className="dashboard-header">
          {/* Dashboard Header */}
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="full"
            bg={color('white', 'gray.800')} // Background color for light/dark mode
            color={color('black', 'white')} // Text color for light/dark mode
          >
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
          {/* Parking Slots List */}
          {parkingSlots.map((slot) => (
            <Flex
              key={slot.id}
              justifyContent="space-between"
              alignItems="center"
              w="full"
              p={4}
              borderWidth="1px"
              borderColor={color('gray.200', 'gray.600')} // Border color for light/dark mode
              borderRadius="md"
              mb={2}
              bg={color('white', 'gray.700')} // Background color for light/dark mode
              color={color('black', 'white')} // Text color for light/dark mode
            >
              <HStack>
                <Car className="text-2xl" color={color('black', 'white')} />
                <Text color={color('black', 'white')}>Parking Slot {slot.id}</Text>
              </HStack>
              <Button
                onClick={() => toggleReservation(slot.id)}
                leftIcon={slot.reserved ? <Unlock color={color('black', 'white')} /> : <Lock color={color('black', 'white')} />}
                colorScheme={slot.reserved ? "red" : "green"}
                size="sm"
              >
                {slot.reserved ? "Cancel" : "Reserve"}
              </Button>
              <Tag
                size="sm"
                colorScheme={slot.reserved ? "red" : "green"}
                borderRadius="full"
              >
                <Circle className={`text-xs ${slot.reserved ? "fill-current" : ""}`} color={color('black', 'white')} />
                {slot.reserved ? "Reserved" : "Available"}
              </Tag>
            </Flex>
            
          ))}
        </aside>
      </div>
      </Container>
    </ChakraProvider>
  );
};

export default SmartParkingDashboard;