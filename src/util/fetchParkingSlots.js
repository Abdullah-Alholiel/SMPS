import axios from "axios";

  // Function to fetch parking slots from the server
export const fetchParkingSlots = async (setParkingSlots, toast, setSelectedSlot, selectedSlot) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/parkingSlots"
      );
      const updatedSlots = response.data.map((slot) => ({
        ...slot,
        reserved: slot.status === "reserved",
        reservationId: slot.reservationId || null,
        userId: slot.userId ? slot.userId._id : null,
      }));
      const currentReservation = updatedSlots.find(
        (slot) => slot.reservationId === selectedSlot?.reservationId
      );
      setParkingSlots(updatedSlots);
      if (currentReservation) {
        setSelectedSlot(currentReservation);
      } else {
        setSelectedSlot(null); // Add this line to reset the selectedSlot if it's no longer reserved
      }
    } catch (error) {
      toast({
        title: "Error fetching parking slots",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };