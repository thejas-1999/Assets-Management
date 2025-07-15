import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// CREATE employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/register`, formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

// FETCH all employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// FETCH employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch by ID failed');
    }
  }
);

// UPDATE employee by ID
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// DELETE employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    employee: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(emp =>
          emp._id === action.payload._id ? action.payload : emp
        );
        state.employee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp._id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
