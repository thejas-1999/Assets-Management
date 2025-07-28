import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../slices/authSlice";
import "./adminDashBoard.css";

const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const goToEmployees = () => {
    navigate("/admin/employeeList");
  };

  const goToAssets = () => {
    navigate("/admin/assets");
  };

  const goToRequests = () => {
    navigate("/admin/assets/showRequest");
  };

  const goToSettings = () => {
    navigate("/admin/settings");
  };

  return (
    <div className="admin-dashboard">
      
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the asset management admin panel</p>
        
      </header>
      

      <section className="dashboard-section quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={goToEmployees}>
            <span className="action-icon">👥</span>
            Manage Employees
          </button>
          <button className="action-btn" onClick={goToAssets}>
            <span className="action-icon">💼</span>
            Manage Assets
          </button>
          <button className="action-btn" onClick={goToRequests}>
            <span className="action-icon">📩</span>
            View Requests
          </button>
          <button className="action-btn" onClick={goToSettings}>
            <span className="action-icon">⚙️</span>
            Settings
          </button>
          <button className="logout-btn" onClick={handleLogout}>
          🔓 Logout
        </button>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Overview</h2>
        <div className="card-grid">
          <div className="dashboard-card employee-card">
            <div className="card-header">
              <div className="card-icon">👥</div>
              <h2>Employee Management</h2>
            </div>
            <p className="card-description">
              View, add, and manage employee details and access levels.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ Add Employee</span>
              <span className="feature-tag">✓ Update Info</span>
              <span className="feature-tag">✓ Role Access</span>
            </div>
            <button onClick={goToEmployees} className="cardBtn">
              <span className="btn-icon">👥</span>
              Go to Employees
            </button>
          </div>

          <div className="dashboard-card asset-card">
            <div className="card-header">
              <div className="card-icon">💼</div>
              <h2>Asset Management</h2>
            </div>
            <p className="card-description">
              Add, assign, and manage assets across departments.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ Assign Asset</span>
              <span className="feature-tag">✓ Return Asset</span>
              <span className="feature-tag">✓ Asset Logs</span>
            </div>
            <button onClick={goToAssets} className="cardBtn">
              <span className="btn-icon">💼</span>
              Go to Assets
            </button>
          </div>

          <div className="dashboard-card request-card">
            <div className="card-header">
              <div className="card-icon">📩</div>
              <h2>Asset Requests</h2>
            </div>
            <p className="card-description">
              View and manage pending asset allocation requests.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ View Requests</span>
              <span className="feature-tag">✓ Approve / Reject</span>
              <span className="feature-tag">✓ Track History</span>
            </div>
            <button onClick={goToRequests} className="cardBtn">
              <span className="btn-icon">📩</span>
              Go to Requests
            </button>
          </div>

          <div className="dashboard-card settings-card">
            <div className="card-header">
              <div className="card-icon">⚙️</div>
              <h2>Configuration</h2>
            </div>
            <p className="card-description">
              Customize asset types, user roles, and system settings.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ Asset Type Management</span>
              <span className="feature-tag">✓ Role Config</span>
              <span className="feature-tag">✓ System Defaults</span>
            </div>
            <button onClick={goToSettings} className="cardBtn secondaryBtn">
              <span className="btn-icon">⚙️</span>
              Go to Settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashBoard;
