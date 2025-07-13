import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice'; // 1. Import the new user slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // 2. Add the user slice reducer
  },
  // No extra middleware is needed for this setup
});
