// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utiils/api'

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Load user from cookie (after refresh)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Not authenticated');
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error sending reset link'
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await api.post(`/users/reset-password/${token}`, { password });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error resetting password'
      );
    }
  }
);




const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    resetMessage: null, // For displaying success messages
  },

  reducers: {
    logout(state) {
      state.userInfo = null;
      document.cookie = 'jwt=; Max-Age=0';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(forgotPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.resetMessage = null;
  })
  .addCase(forgotPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.resetMessage = action.payload;
  })
  .addCase(forgotPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }) .addCase(resetPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.resetMessage = null;
  })
  .addCase(resetPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.resetMessage = action.payload;
  })
  .addCase(resetPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
