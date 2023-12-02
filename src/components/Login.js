import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../services/authService'

const Login = () => {
  const [user_email, setUserName] = useState('');
  const [user_password, setPassword] = useState('');

  const loginCheck = (event) => {
    event.preventDefault();
    console.log("tried");
    axios
      .post('https://shy-frog-boot.cyclic.app/users/login', {
        username: user_email,
        password: user_password,
      })
      .then((response) => {
        if (!response.data.token) {
          console.log("no data found");
          // Alert.alert("Login", "Invalid Credentials");
        } else {
          console.log("data found");
          global.email = user_email;
          
        }
        Navigate('/dashboard');
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box>
      <form onSubmit={ loginCheck} >
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" value={user_email} onChange={(e) => setUserName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={user_password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="teal" onSubmit= {()=>{loginCheck()} } mt={4}>Login</Button >
      </form>
    </Box>
  );
};

export default Login;



/*
const auth = useAuth();
const navigate = useNavigate();
const [credentials, setCredentials] = useState({ username: '', password: '' });

const handleChange = (e) => {
  setCredentials({ ...credentials, [e.target.name]: e.target.value });
};

const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post('/users/login', credentials);
    console.log('User logged in:', response.data);
    if (response.data.token) {
      auth.login(credentials.username, credentials.password);
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
} ;
*/