import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null, // Will hold user info and token
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to set user info on login
    setCredentials(state, action) {
      state.userInfo = action.payload;
    },
    // Reducer to clear user info on logout
    logOut(state) {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;