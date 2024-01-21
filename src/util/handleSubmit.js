import axios from "axios";

export const handleSubmit = async (reservation, setIsSubmitting, setCancelDisabled, setMessage, setIsReservationFormOpen, fetchParkingSlots) => {
    setIsSubmitting(true);
    setCancelDisabled(true); // Disable the cancel button while the reservation is being created

    let userId;
    try {
      const cookies = new Cookies();
      userId = cookies.get("userId");
      if (!userId) {
        const cookies = new Cookies();
        userId = cookies.get("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }
      }
      const response = await axios.post(
        "http://localhost:3001/api/reservations/createreservation",
        {
          userId: userId,
          slotNumber: parseInt(reservation.slotId),
          duration: parseInt(reservation.duration), // Include duration in the request
        }
      );

      setMessage("Reservation created successfully");
      setIsReservationFormOpen(false);
      fetchParkingSlots(); // Refresh the slots after successful reservation
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setCancelDisabled(false); // Enable the cancel button after the reservation is created or an error occurs
    }
  };