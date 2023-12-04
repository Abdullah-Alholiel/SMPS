import axios from 'axios';

const API_URL = 'http://localhost:3001';
const REGISTER_URL = '/users/register';
const LOGIN_URL = '/users/login';

axios.defaults.baseURL = API_URL;

const auth = {
  register: async (userData) => {
    try {
      const response = await axios.post(REGISTER_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
  login: async (userCredentials) => {
    try {
      const response = await axios.post(LOGIN_URL, userCredentials);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

export default auth;
