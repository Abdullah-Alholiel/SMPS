import {
    ChakraProvider,
    Box,
    Flex,
    Heading,
    Button,
    Grid,
    Badge,
    Input,
    Select,
    Alert,
    AlertIcon,
    Text,
  } from "@chakra-ui/react";
  import { Car } from "lucide-react";
  import { render } from "react-dom";
  import React, { useState, useEffect, useRef } from "react";
  const SmartParkingDashboard = () => {
    return (
      <ChakraProvider>
        <Box bg="gray.100" p={4}>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading as="h1" size="xl">
              Smart Parking Dashboard
            </Heading>
            <Button colorScheme="teal">Logout</Button>
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Heading as="h2" size="md" mb={2}>
                Parking Lot Availability
              </Heading>
              <Badge colorScheme="green" variant="subtle">
                Available
              </Badge>
              <Badge colorScheme="yellow" variant="subtle">
                Limited Availability
              </Badge>
              <Badge colorScheme="red" variant="subtle">
                Full
              </Badge>
            </Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Heading as="h2" size="md" mb={2}>
                Filter Options
              </Heading>
              <Input type="text" placeholder="Search..." mb={2} />
              <Select placeholder="Sort by">
                <option value="availability">Availability</option>
                <option value="price">Price</option>
              </Select>
            </Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Heading as="h2" size="md" mb={2}>
                Notifications
              </Heading>
              <Alert status="success">
                <AlertIcon />
                Parking lot available!
              </Alert>
            </Box>
          </Grid>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={4}>
            {/* Parking lot cards */}
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Flex alignItems="center">
                <Car size={24} />
                <Heading as="h3" size="md" ml={2} mb={2}>
                  Parking Lot A
                </Heading>
              </Flex>
              <Text>Availability: 10/20</Text>
              <Text>Price: $10/hour</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Flex alignItems="center">
                <Car size={24} />
                <Heading as="h3" size="md" ml={2} mb={2}>
                  Parking Lot B
                </Heading>
              </Flex>
              <Text>Availability: 5/20</Text>
              <Text>Price: $12/hour</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Flex alignItems="center">
                <Car size={24} />
                <Heading as="h3" size="md" ml={2} mb={2}>
                  Parking Lot C
                </Heading>
              </Flex>
              <Text>Availability: 15/20</Text>
              <Text>Price: $8/hour</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="lg">
              <Flex alignItems="center">
                <Car size={24} />
                <Heading as="h3" size="md" ml={2} mb={2}>
                  Parking Lot D
                </Heading>
              </Flex>
              <Text>Availability: 2/20</Text>
              <Text>Price: $15/hour</Text>
            </Box>
          </Grid>
        </Box>
      </ChakraProvider>
    );
  };
  export default SmartParkingDashboard;
  render(<SmartParkingDashboard />, document.getElementById("root"));
  