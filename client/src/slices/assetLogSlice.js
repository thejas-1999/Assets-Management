import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAssetLogsById = createAsyncThunk(
  "assetLogs/fetchByAssetId",
  async (assetId, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/asset-logs/${assetId}`, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const assetLogSlice = createSlice({
  name: "assetLogs",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetLogsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetLogsById.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAssetLogsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assetLogSlice.reducer;
