import { createSlice } from '@reduxjs/toolkit';

const storedUserInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: storedUserInfo,
  status: 'idle',
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to set user info on login
    setCredentials(state, action) {
    state.userInfo = action.payload;
    localStorage.setItem('userInfo', JSON.stringify(action.payload));
  },

    // Reducer to clear user info on logout
    logOut(state) {
    state.userInfo = null;
    localStorage.removeItem('userInfo');
  },

  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;