import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
  } from "@chakra-ui/react";
  
  const ReservationForm = ({ onReservationSuccess }) => {
    // Initialize state for reservation, submission status, and message
    const [reservation, setReservation] = useState({
      duration: "30", // Default duration in minutes
      slotId: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
  
    // Handle input change
    const handleChange = (event) => {
      const { name, value } = event.target;
      setReservation((prevState) => ({ ...prevState, [name]: value }));
    };
  
    // Handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
  
      // Calculate endTime based on the duration
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + reservation.duration * 60000);
  
      try {
        // Retrieve user ID from localStorage
        const userId = localStorage.getItem("user_id");
        // Ensure slotId is a number
        const slotNumber = parseInt(reservation.slotId);
  
        // Send reservation data to the server
        const response = await axios.post(
          "https://fluffy-wasp-windbreaker.cyclic.app/reservations/createreservation",
          {
            userId,
            slotNumber,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          }
        );
  
        // Update message and trigger onReservationSuccess
        setMessage("Reservation created successfully");
        if (onReservationSuccess) {
          onReservationSuccess(response.data);
        }
        setIsSubmitting(false);
      } catch (error) {
        // Handle error and update message
        const errorMessage = error.response ? error.response.data.error : error.message;
        setMessage("Error: " + errorMessage);
        setIsSubmitting(false);
      }
    };
  
    return (
      <Box
        as="form"
        onSubmit={handleSubmit}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
      >
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="duration">Duration (minutes):</FormLabel>
            <Select
              id="duration"
              name="duration"
              value={reservation.duration}
              onChange={handleChange}
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="slotId">Slot ID:</FormLabel>
            <Input
              type="text"
              id="slotId"
              name="slotId"
              value={reservation.slotId}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button
            type="submit"
            disabled={isSubmitting}
            colorScheme="blue"
            size="md"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Creating Reservation..." : "Create Reservation"}
          </Button>
          {message && <Text>{message}</Text>}
        </Stack>
      </Box>
    );
  };
  
  export default ReservationForm;