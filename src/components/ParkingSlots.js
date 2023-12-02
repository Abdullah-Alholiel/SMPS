import React from 'react';
import { Box, Text, Button } from "@chakra-ui/react";

const ParkingSlots = () => {
  // Placeholder data. Fetch real data from backend.
  const slots = [
    { id: 1, status: 'available' },
    { id: 2, status: 'available' },
    { id: 3, status: 'occupied' },
  ];

  return (
    <Box>
      {slots.map(slot => (
        <Box key={slot.id} p={4} boxShadow="md" mb={4}>
          <Text>Parking Slot {slot.id}</Text>
          <Button size="sm" colorScheme={slot.status === 'available' ? 'green' : 'red'}>
            {slot.status === 'available' ? 'Reserve' : 'Occupied'}
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export default ParkingSlots;
