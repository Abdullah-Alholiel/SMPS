import React, { useState, useEffect } from 'react';
import { Container, Flex, Text, Box, useToast } from "@chakra-ui/react"; // Include Box in the import
import Cookies from 'universal-cookie';
import axios from 'axios';
import ReservationsList from './ReservationsList'; // Import the ReservationsList component

const UserReservations = () => {
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const toast = useToast();
    const cookies = new Cookies();
    const username = cookies.get("username");

    // Effect to retrieve user ID and role from storage
    useEffect(() => {
        const userId = cookies.get("userId"); 
        const userRole = cookies.get("userRole");
        if (userId && userRole) {
            setUserId(userId);
            setUserRole(userRole);
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

    // Function to cancel a reservation
    const cancelReservation = async (reservation) => {
        try {
            await axios.delete(`http://localhost:3001/api/reservations/${reservation._id}`, {
                data: {
                    userId: reservation.userId._id,
                    slotNumber: reservation.slotNumber
                }
            });
            toast({
                title: "Reservation cancelled",
                description: "Your reservation has been cancelled",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            // Refresh the reservations list after cancellation
        } catch (error) {
            toast({
                title: 'Error cancelling reservation',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" p={{ base: 3, md: 5 }} centerContent>
            <Flex direction="column" align="center" justify="center" w="100%">
                {userRole === "admin" ? (
                    <Text fontSize={{ base: "xl", md: "2xl" }} mb={5}>
                        Hey {username}, Here are all users' reservations
                    </Text>
                ) : (
                    <Text fontSize={{ base: "xl", md: "2xl" }} mb={5}>
                        Hey {username}, Here are your reservations
                    </Text>
                )}
                <Box w="100%" px={{ base: 3, md: 5 }}>
                    <ReservationsList userId={userId} userRole={userRole} onCancel={cancelReservation} />
                </Box>
            </Flex>
        </Container>
    );
};

export default UserReservations;
