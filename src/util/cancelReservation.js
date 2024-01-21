 // Function to cancel a reservation
 import axios from "axios";

 export const cancelReservation = async (selectedSlot, toast, navigate, fetchParkingSlots, setIsCancelConfirmOpen, setCancelDisabled) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/reservations/${selectedSlot.reservationId}`,
        {
          data: {
            userId: userId,
            slotNumber: selectedSlot.slotNumber,
          },
        }
      );
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard/reservations");
      fetchParkingSlots(); // Refresh the slots after cancellation
    } catch (error) {
      toast({
        title: "Error cancelling reservation",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsCancelConfirmOpen(false); // Close the confirmation dialog
      setCancelDisabled(false); // Enable the cancel button after the reservation is cancelled
    }
  };