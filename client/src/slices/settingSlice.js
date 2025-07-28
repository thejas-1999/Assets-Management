// slices/settingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, thunkAPI) => {
  const { userInfo } = thunkAPI.getState().auth;
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/settings', config);
  return data;
});

export const updateAssetTypes = createAsyncThunk('settings/updateAssetTypes', async (assetTypes, thunkAPI) => {
  const { userInfo } = thunkAPI.getState().auth;
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.put('/api/settings/asset-types', { assetTypes }, config);
  return data;
});

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    assetTypes: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.assetTypes = action.payload.assetTypes;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAssetTypes.fulfilled, (state, action) => {
        state.assetTypes = action.payload.assetTypes;
      });
  },
});

export default settingSlice.reducer;
