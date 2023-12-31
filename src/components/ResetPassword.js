import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate(); // Call useNavigate to get the navigate function

    const handleResetPassword = async () => {
        try {
            await axios.post('https://smps-shu.onrender.com/api/users/resetPassword', { token, newPassword });
            toast({ title: 'Password reset successfully', status: 'success' });
            navigate('/login'); // Navigate to /login after success
        } catch (error) {
            toast({ title: 'Error resetting password', description: error.response.data.error, status: 'error' });
        }
    };

    return (
        <Box>
            <FormControl isRequired>
                <FormLabel>Reset Token</FormLabel>
                <Input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </FormControl>
            <Button onClick={handleResetPassword}>Reset Password</Button>
        </Box>
    );
};

export default ResetPassword;