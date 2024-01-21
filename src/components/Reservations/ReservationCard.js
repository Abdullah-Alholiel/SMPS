import React from 'react';
import { Box, Flex, Text, Button, Badge, VStack, useColorModeValue } from "@chakra-ui/react";
import { formatDate } from '/Users/Abdullah/code/spms/spms/src/util/formatDate.js';
import { getStatusColorScheme } from '/Users/Abdullah/code/spms/spms/src/util/getStatusColorScheme.js';

const ReservationCard = ({ reservation, onCancel }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      boxShadow='md'
      rounded='lg'
      p={6}
      mb={5}
      border="1px"
      borderColor={borderColor}
      maxW="100%"
    >
      <VStack align="start" spacing={3}>
      <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Text fontWeight="bold" fontSize="lg">Reservation for Slot {reservation.slotNumber}</Text>
          <Badge colorScheme={getStatusColorScheme(reservation.reservationStatus)}>
            {reservation.reservationStatus}
          </Badge>
        </Flex>
        <Text fontSize="sm" color="gray.500">ReservationID: {reservation._id}</Text>
        <Text fontSize="sm" color="gray.500">User: {reservation.userId.username}</Text>
        <Text fontSize="sm" color="gray.500">Slot Number: {reservation.slotNumber}</Text>
        <Text fontSize="sm" color="gray.500">Status: {reservation.reservationStatus}</Text>
        <Text fontSize="sm" color="gray.500">Start Time: {formatDate(reservation.startTime)}</Text>
        <Text fontSize="sm" color="gray.500">End Time: {formatDate(reservation.endTime)}</Text>
        {reservation.reservationStatus === 'active' && (
        <Button colorScheme="red" onClick={() => onCancel(reservation)}>
          Cancel Reservation
        </Button>
      )}
        {/* Additional reservation details or actions can be added here */}
      </VStack>
    </Box>
  );
};

export default ReservationCard;
