// IoTEmulator.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Text, Divider, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton, Image, useToast
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const IoTEmulator = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/parkingSlots');
        const updatedSlots = response.data.map(slot => ({
          ...slot,
          reserved: slot.status === 'reserved',
          reservationId: slot.reservationId || null,
          userId: slot.userId ? slot.userId._id : null
        }));
        setParkingSlots(updatedSlots);
        if (selectedSlot) {
          const currentReservation = updatedSlots.find(slot => slot.reservationId === selectedSlot.reservationId);
          setSelectedSlot(currentReservation);
        }
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
  }, [selectedSlot, toast]);

  const handleSliderChange = (value, index) => {
    const newParkingSlots = [...parkingSlots];
    newParkingSlots[index].currentDistance = value;
    setParkingSlots(newParkingSlots);
  };

  const handleUpdateDistance = async (index) => {
    try {
      const slot = parkingSlots[index];
      await axios.put(`http://localhost:3001/api/parkingSlots/${slot.slotNumber}`, {
        slotNumber: slot.slotNumber,
        currentDistance: slot.currentDistance,
        status: slot.currentDistance < 150 ? 'occupied' : 'available',
        reservedBy: slot.reservedBy,
      });
      toast({
        title: `Distance for slot ${slot.slotNumber} updated successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Error updating distance for slot ${index + 1}`,
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box m={4}>
      <Text fontSize="2xl" mb={2}>Smart Parking System Prototype</Text>
      <Divider mb={4} />
      {parkingSlots.map((slot, index) => (
        <Box key={index} mb={6}>
          <Text>Parking Slot {slot.slotNumber}: {slot.currentDistance < 100 ? 'Occupied' : 'Available'}</Text>
          <Slider
            aria-label={`slider-ex-${index}`}
            value={slot.currentDistance}
            onChange={(val) => handleSliderChange(val, index)}
            max={400}
            mb={2}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Box display="flex" alignItems="center">
            <Text mr={2}>{slot.currentDistance} cm</Text>
            <IconButton
              icon={<EditIcon />}
              aria-label={`edit-distance-${index}`}
              onClick={() => handleUpdateDistance(index)}
            />
          </Box>
        </Box>
      ))}
      <Image src="../IoTstructure.png" alt="IoT Component Structure" />
    </Box>
  );
};

export default IoTEmulator;