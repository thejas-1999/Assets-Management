import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/assets';

// Fetch all assets
const fetchAssets = createAsyncThunk('assets/fetchAssets', async (_, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get(`${API_URL}/getallassets`, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Delete asset
const deleteAsset = createAsyncThunk('assets/deleteAsset', async (id, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Return asset
const returnAsset = createAsyncThunk('assets/returnAsset', async (id, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`${API_URL}/${id}/return`, {}, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Create asset
const createAsset = createAsyncThunk('assets/createAsset', async (assetData, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`${API_URL}/create`, assetData, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update asset
const updateAsset = createAsyncThunk('assets/updateAsset', async ({ id, assetData }, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`${API_URL}/${id}`, assetData, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Assign asset to user
const assignAsset = createAsyncThunk('assets/assignAsset', async ({ id, userId }, thunkAPI) => {
  try {
    const { userInfo } = thunkAPI.getState().auth;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`${API_URL}/${id}/assign`, { userId }, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Request asset

export const requestAsset = createAsyncThunk(
  'assets/requestAsset',
  async ({ assetType, reason }, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true
      };
      const { data } = await axios.post('/api/assets/request', { assetType, reason }, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'assets/updateRequestStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/assets/requests/${id}`, { status }, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




// Fetch logged-in user's asset requests
export const fetchMyRequests = createAsyncThunk(
  'assets/fetchMyRequests',
  async (_, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('/api/assets/myrequests', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Admin: Fetch all asset requests
export const fetchAllRequests = createAsyncThunk(
  'assets/fetchAllRequests',
  async (_, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('/api/assets/requests', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Start maintenance
const startMaintenance = createAsyncThunk(
  'assets/startMaintenance',
  async ({ id, description }, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/${id}/start-maintenance`, { description }, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Complete maintenance
const completeMaintenance = createAsyncThunk(
  'assets/completeMaintenance',
  async ({ id, daysTaken, cost, description }, thunkAPI) => {
    try {
      const { userInfo } = thunkAPI.getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${id}/complete-maintenance`,
        { daysTaken, cost, description },
        config
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assets: [],
    myRequests: [],
    allRequests: [], // 🆕 For admin
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAsset.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Return
      .addCase(returnAsset.fulfilled, (state, action) => {
        state.assets = state.assets.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(returnAsset.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(createAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.push(action.payload);
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = state.assets.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign
      .addCase(assignAsset.fulfilled, (state, action) => {
        state.assets = state.assets.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(assignAsset.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(requestAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestAsset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin: fetch all requests
      .addCase(fetchAllRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.allRequests = state.allRequests.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      // Start maintenance reducers
builder
  .addCase(startMaintenance.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(startMaintenance.fulfilled, (state, action) => {
    state.loading = false;
    state.assets = state.assets.map((a) =>
      a._id === action.payload._id ? action.payload : a
    );
  })
  .addCase(startMaintenance.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

// Complete maintenance reducers
builder
  .addCase(completeMaintenance.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(completeMaintenance.fulfilled, (state, action) => {
    state.loading = false;
    state.assets = state.assets.map((a) =>
      a._id === action.payload._id ? action.payload : a
    );
  })
  .addCase(completeMaintenance.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });




  },
});

export default assetSlice.reducer;

export {
  fetchAssets,
  deleteAsset,
  returnAsset,
  createAsset,
  updateAsset,
  assignAsset,
  startMaintenance,
  completeMaintenance
};
