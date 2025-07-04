import axios from 'axios';

// Create a new Axios instance with a base URL
// All requests made with this instance will be prefixed with the base URL
const axiosInstance = axios.create({
  // Replace this with your actual backend URL, which you can store in an environment variable
  baseURL: process.env.REACT_APP_API_URL, 
});

// You can also add interceptors here later to automatically
// attach the auth token to every request.
//
// axiosInstance.interceptors.request.use((config) => {
//   const token = store.getState().auth.userInfo?.token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosInstance;
