import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import AdminDashBoard from "./pages/admin/employeeDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/employees/employeeDashboard/EmployeeDashboard"
import UnauthorizedPage from "./pages/unAuthorizedPage";
import ProtectedRoute from "./components/protectRoute";

import AssetsPage from "./pages/assets/assetpages/AssetsPage";
import EmployeeList from "./pages/admin/employeeList/EmployeeList";
import EmployeeRegisterPage from "./employeeRegisteration/EmployeeRegisterPage";
import EmployeeEditPage from "./pages/EmployeeEditPage";
import AssetCreatePage from "./pages/assets/createAsset/AssetCreate";
import AssetEditPage from "./pages/assets/assetEdit/AssetEditPage";
import AssignAssetPage from "./pages/assets/assignAssets/AssignAssetPage";
import AdminRequestShowPage from "./pages/adminrequestshowpage/AdminRequestShowPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Route */}
      <Route index element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Admin Route */}
      <Route
        element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}
      >
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/employeeList" element={<EmployeeList />} />
        <Route
          path="/admin/employees/register"
          element={<EmployeeRegisterPage />}
        />
        <Route
          path="/admin/employees/edit/:id"
          element={<EmployeeEditPage />}
        />
        <Route path="/admin/assets" element={<AssetsPage />} />
        <Route path="/admin/assets/create" element={<AssetCreatePage />} />
        <Route path="/admin/assets/edit/:id" element={<AssetEditPage />} />
        <Route path="/admin/assets/assign" element={<AssignAssetPage />} />
        <Route path="/admin/assets/showRequest" element={<AdminRequestShowPage />} />
      </Route>

      {/* ✅ Protected Employee Route */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/employeedashboard" element={<EmployeeDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
