import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAsset, fetchMyRequests } from '../../../slices/assetSlice';
import './employeeDashboard.css';

const EmployeeDashboard = () => {
  const [assetType, setAssetType] = useState('');
  const [reason, setReason] = useState('');
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { myRequests, loading, error } = useSelector((state) => state.asset);

  useEffect(() => {
    if (userInfo && userInfo.role === 'user') {
      dispatch(fetchMyRequests());
    }
  }, [dispatch, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!assetType) return;
    dispatch(requestAsset({ assetType, reason }));
    setAssetType('');
    setReason('');
    setTimeout(() => {
      if (userInfo && userInfo.role === 'user') {
        dispatch(fetchMyRequests());
      }
    }, 1000);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Asset Request Dashboard</h1>
        <p className="dashboard-subtitle">Request and track your asset requests</p>
      </div>

      <div className="dashboard-content">
        <div className="request-form-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              New Asset Request
            </h2>
          </div>

          <form onSubmit={submitHandler} className="request-form">
            <div className="form-group">
              <label className="form-label">
                Asset Type <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select Asset Type</option>
                  <option value="Laptop">💻 Laptop</option>
                  <option value="Phone">📱 Phone</option>
                  <option value="Monitor">🖥️ Monitor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Justification <span className="optional">(optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-textarea"
                placeholder="Briefly explain why you need this asset..."
                rows="3"
              />
            </div>

            <button type="submit" className="submit-button">
              <span className="button-icon">🚀</span>
              Submit Request
            </button>
          </form>
        </div>

        <div className="requests-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📊</span>
              My Requests
            </h2>
          </div>

          <div className="requests-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your requests...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            ) : (
              <div className="requests-list">
                {myRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <p>No requests found</p>
                    <span>Your asset requests will appear here</span>
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div key={req._id} className="request-card">
                      <div className="request-header">
                        <div className="asset-info">
                          <h3 className="asset-type">{req.assetType}</h3>
                          <span className={`status-badge status-${req.status}`}>
                            {req.status === 'approved' && '✅'}
                            {req.status === 'rejected' && '❌'}
                            {req.status === 'pending' && '⏳'}
                            {req.status}
                          </span>
                        </div>
                        <div className="request-date">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {req.reason && (
                        <div className="request-reason">
                          <strong>Justification:</strong> {req.reason}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;