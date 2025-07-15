import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import assetReducer from './slices/assetSlice'; // ✅ Import asset slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    asset: assetReducer, // ✅ Register asset slice here
  },
});
