// pages/AdminDashBoard.jsx
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice'
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // External CSS for styling

const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const goToEmployees = () => {
    navigate('/admin/employeeList');
  };

  const goToAssets = () => {
    navigate('/admin/assets');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">⚡</span>
            Admin Dashboard
          </h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">Administrator</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back!</h2>
          <p className="welcome-text">
            Manage your organization efficiently with our comprehensive admin tools.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="stat-number">142</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>Active Assets</h3>
              <p className="stat-number">89</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Departments</h3>
              <p className="stat-number">12</p>
            </div>
          </div>
        </div>

        <div className="card-grid">
          <div className="dashboard-card employee-card">
            <div className="card-header">
              <div className="card-icon">👥</div>
              <h2>Employee Management</h2>
            </div>
            <p className="card-description">
              Manage and monitor employee details, departments, and performance metrics.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ Employee Profiles</span>
              <span className="feature-tag">✓ Department Management</span>
              <span className="feature-tag">✓ Performance Tracking</span>
            </div>
            <button onClick={goToEmployees} className="card-btn primary-btn">
              <span className="btn-icon">👀</span>
              View Employees
            </button>
          </div>

          <div className="dashboard-card asset-card">
            <div className="card-header">
              <div className="card-icon">💼</div>
              <h2>Asset Management</h2>
            </div>
            <p className="card-description">
              Track, assign, and maintain office assets and equipment inventory.
            </p>
            <div className="card-features">
              <span className="feature-tag">✓ Asset Tracking</span>
              <span className="feature-tag">✓ Assignment Management</span>
              <span className="feature-tag">✓ Maintenance Records</span>
            </div>
            <button onClick={goToAssets} className="card-btn secondary-btn">
              <span className="btn-icon">📋</span>
              View Assets
            </button>
          </div>
        </div>

        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">➕</span>
              Add Employee
            </button>
            <button className="action-btn">
              <span className="action-icon">📦</span>
              Add Asset
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              Generate Report
            </button>
            <button className="action-btn">
              <span className="action-icon">⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
