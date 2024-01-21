import React, { useState, useEffect } from 'react';
import { Box, Text, SimpleGrid, HStack, Button, useToast } from "@chakra-ui/react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import ReservationCard from './ReservationCard';

const ReservationsList = ({ userId, userRole, onCancel }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [reservationsPerPage] = useState(3);
    const [userReservation, setUserReservation] = useState(null);
  
  
    const toast = useToast();
  
  
    // Effect to fetch reservations from the API
    useEffect(() => {
      const fetchReservations = async () => {
        try {
          const cookies = new Cookies();
          let response;
          const userId = cookies.get("userId");
          const userRole = cookies.get("userRole");
          const username = cookies.get("username");
          if (userRole === 'admin') {
            response = await axios.get("http://localhost:3001/api/reservations");
          } else {
            response = await axios.get(`http://localhost:3001/api/reservations/${userId}`);
          }
          setReservations(response.data);
          if (userRole === 'admin') {
            const foundReservation = response.data.find((reservation) => reservation.userId.username === username);
            setUserReservation(foundReservation);
          }      } catch (err) {
          setError('Failed to fetch reservations');
          console.error(err); // Log the error for debugging
          toast({
            title: "Error fetching reservations",
            description: err.message || 'Failed to fetch reservations',
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
    
      fetchReservations();
    }, [userId, userRole, toast]); // Dependencies array
  
  
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
  
    // Render reservations
  return (
    <Box>
      <SimpleGrid columns={1} spacing={5}>
        {currentReservations.map((reservation) => (
          <Box key={reservation._id} p={4} borderWidth="1px" borderRadius="lg">
            <ReservationCard reservation={reservation} onCancel={onCancel} />
          </Box>
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

export default ReservationsList;
