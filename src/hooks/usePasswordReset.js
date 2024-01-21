import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// useenavigate

const usePasswordReset = () => {
  const toast = useToast();
  const navigate  = useNavigate();

  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/requestPasswordReset', { email });
      if (response.status === 200) {
        toast({ title: "Password reset email sent", status: 'success' });
        navigate('/reset-password'); // Redirect to reset-password page
      } else {
        toast({ title: "Failed to send password reset email", description: response.data.message, status: 'error' });
      }
    } catch (error) {
      toast({
        title: "Failed to send password reset email",
        description: error.response?.data?.message || 'An unexpected error occurred',
        status: 'error'
      });
    }
  };
  

  return handleForgotPassword;
};

export default usePasswordReset;
