import axios from 'axios';
import { store } from '../app/store';

// Create a new Axios instance with a base URL
// All requests made with this instance will be prefixed with the base URL
const axiosInstance = axios.create({
  // Replace this with your actual backend URL, which you can store in an environment variable
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, // ✅ Include credentials (cookies)

});

export default axiosInstance;
