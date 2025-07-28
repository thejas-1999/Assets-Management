import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import assetReducer from './slices/assetSlice';
import assetLogsReducer from './slices/assetLogSlice'
import settingReducer from './slices/settingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    asset: assetReducer,
    assetLogs: assetLogsReducer,
    settings: settingReducer,
  },
});
