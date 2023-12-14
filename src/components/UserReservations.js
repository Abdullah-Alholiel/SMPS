import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Container,
  VStack,
  useColorModeValue,
  useToast,
  SimpleGrid,
  HStack
} from "@chakra-ui/react";


// Function to format dates for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusColorScheme = (status) => {
  const statusColorMapping = {
    active: 'green',
    completed: 'blue',
    cancelled: 'red'
  };
  return statusColorMapping[status.toLowerCase()] || 'gray';
};
// Card component to display individual reservation details
const ReservationCard = ({ reservation }) => {
  // Define colors based on the color mode
  
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
        <Text fontSize="sm" color="gray.500">Start Time: {formatDate(reservation.startTime)}</Text>
        <Text fontSize="sm" color="gray.500">End Time: {formatDate(reservation.endTime)}</Text>
        {/* Additional reservation details or actions can be added here */}
      </VStack>
    </Box>
  );
};

// Component to list all reservations with pagination
const ReservationsList = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(3); // Show only 3 reservations per page

  const toast = useToast();

  // Effect to fetch reservations from the API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("https://smps-shu.onrender.com/reservations", {
          params: { userId: userId }
        });
        setReservations(response.data);
      } catch (err) {
        setError('Failed to fetch reservations');
        toast({
          title: "Error",
          description: "Failed to fetch reservations",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId, toast]);

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers logic
  const totalPageNumbers = Math.ceil(reservations.length / reservationsPerPage);
  let visiblePageNumbers = Array.from({ length: Math.min(5, totalPageNumbers) }, (_, i) => i + 1);

  // Adjust visible page numbers when there are more than 10 pages
  if (totalPageNumbers > 10) {
    if (currentPage > 3) {
      visiblePageNumbers = Array.from({ length: 5 }, (_, i) => i + currentPage - 2);
    }
    if (currentPage > totalPageNumbers - 3) {
      visiblePageNumbers = Array.from({ length: 5 }, (_, i) => totalPageNumbers - 4 + i);
    }
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <Box>
      <SimpleGrid columns={1} spacing={5}>
        {currentReservations.map((reservation) => (
          <ReservationCard key={reservation._id} reservation={reservation} />
        ))}
      </SimpleGrid>
      {totalPageNumbers > 1 && (
        <HStack spacing={8} direction="row" align="center" justify="center" mt={4} overflowX="auto">
    {totalPageNumbers > 5 && (
      <Button
        onClick={() => paginate(1)}
        colorScheme={currentPage === 1 ? 'blue' : 'gray'}
        disabled={currentPage === 1}
      >
        First
      </Button>
    )}
    {visiblePageNumbers.map(number => (
      <Button
        key={number}
        onClick={() => paginate(number)}
        colorScheme={currentPage === number ? 'blue' : 'gray'}
      >
        {number}
      </Button>
    ))}
    {totalPageNumbers > 5 && (
      <Button
        onClick={() => paginate(totalPageNumbers)}
        colorScheme={currentPage === totalPageNumbers ? 'blue' : 'gray'}
        disabled={currentPage === totalPageNumbers}
      >
        Last
      </Button>
    )}
  </HStack>
      )}
    </Box>
  );
};

// Main component to manage user reservations
const UserReservations = () => {
  const [userId, setUserId] = useState('');
  const toast = useToast();

  // Effect to retrieve user ID from storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in to view your reservations.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [toast]);

  if (!userId) return <Text>Please log in to view your reservations.</Text>;

  return (
<Container maxW="container.xl" p={{ base: 3, md: 5 }} centerContent>
  <Flex direction="column" align="center" justify="center" w="100%">
    <Text fontSize={{ base: "xl", md: "2xl" }} mb={5}>Your Reservations</Text>
    <Box w="100%" px={{ base: 3, md: 5 }}>
      <ReservationsList userId={userId} />
    </Box>
  </Flex>
</Container>
  );
};

export default UserReservations;
