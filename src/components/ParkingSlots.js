import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from '@chakra-ui/react';

const ParkingSlots = () => {
  const [parkingSlots, setParkingSlots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fluffy-wasp-windbreaker.cyclic.app/parkingSlots');
        console.log(response.data);  
        setParkingSlots(response.data);
      } catch (error) {
        console.error('Error fetching parking slots data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box w="100%" p={4}>
      <Heading as="h2" size="lg" mb={4}>Parking Slots</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Slot Number</Th>
            <Th>Status</Th>
            <Th>Reservation Id</Th>
            <Th>Current Distance</Th>
            <Th>Reserved By</Th>
            <Th>is Available</Th>
            <Th>Last Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {parkingSlots.map(slot => (
            <Tr key={slot._id}>
              <Td>{slot.slotNumber}</Td>
              <Td>{slot.status}</Td>
              <Td>{slot.userId || 'Not Reserved'}</Td>
              <Td>{slot.currentDistance}</Td>
              <Td>{slot.reservedBy || 'Not Reserved'}</Td>
              <Td> {slot.isAvailable ? 'Yes' : 'No'}</Td>
              <Td>{new Date(slot.lastUpdated).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ParkingSlots;
