// src/pages/AdminRequestShowPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRequests, fetchAssets } from "../../slices/assetSlice";
import { useNavigate } from "react-router-dom";
import './adminShow.css'

const AdminRequestShowPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allRequests, loading, error } = useSelector((state) => state.asset);

  useEffect(() => {
    dispatch(fetchAllRequests());
    dispatch(fetchAssets());
  }, [dispatch]);

  const handleAssign = (userId, assetType, requestId) => {
    // Navigate to AssignAssetPage with prefilled data
    navigate(
  `/admin/assets/assign?userId=${userId}&assetType=${assetType}&requestId=${requestId}`
);

  };

  return (
    <div className="admin-dashboard">
      <h2 className="section-title">User Asset Requests</h2>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && allRequests?.length === 0 && <p>No asset requests found.</p>}

      <div className="request-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Asset Type</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map((req) => (
              <tr key={req._id}>
                <td>
                  {req.user?.name} ({req.user?.email})
                </td>
                <td>{req.assetType}</td>
                <td>{req.status}</td>
                <td>{req.reason || "—"}</td>
                <td>{new Date(req.createdAt).toLocaleString()}</td>
                <td>
                  {req.status === "pending" && (
                    <button
                      onClick={() =>
                        handleAssign(req.user._id, req.assetType, req._id)
                      }
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequestShowPage;
