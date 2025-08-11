// src/slices/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utiils/api'; // shared Axios instance

// CREATE employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/users/register', formData);
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
      const res = await api.get('/users');
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
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch by ID failed');
    }
  }
);

// ✅ FETCH employee profile with asset history
export const getEmployeeProfile = createAsyncThunk(
  'employees/getEmployeeProfile',
  async (employeeId, thunkAPI) => {
    try {
      // Changed "employees" → "users" to match backend route
      const res = await api.get(`/users/${employeeId}/profile`);
      return res.data; // contains employee info + asset history
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Profile fetch failed');
    }
  }
);


// UPDATE employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/users/${id}`, data);
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
      await api.delete(`/users/${id}`);
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
    employeeProfile: null, // ✅ stores profile with asset history
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH all
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

      // FETCH by ID
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

      // ✅ FETCH profile
      .addCase(getEmployeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeProfile = action.payload;
      })
      .addCase(getEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
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

      // UPDATE
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

      // DELETE
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp._id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
