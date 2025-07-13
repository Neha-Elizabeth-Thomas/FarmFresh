import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

// --- Async Thunks for API calls ---

export const getProfile = createAsyncThunk('user/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('user/profile');
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put('user/profile', profileData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteAddress = createAsyncThunk('user/deleteAddress', async (addressId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`user/profile/address/${addressId}`);
        return addressId; // Return the ID to identify which address to remove from state
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


// --- User Slice Definition ---

const initialState = {
  profileData: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profileData = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
      })
      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
          if (state.profileData) {
              state.profileData.deliveryAddress = state.profileData.deliveryAddress.filter(
                  (addr) => addr._id !== action.payload
              );
          }
      });
  },
});

export default userSlice.reducer;
