import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssetLogsById } from "../../../slices/assetLogSlice";
import "./assetHistory.css";

const AssetHistoryPage = () => {
  const { assetId } = useParams();
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.assetLogs);

  useEffect(() => {
    dispatch(fetchAssetLogsById(assetId));
  }, [dispatch, assetId]);

  return (
    <div className="asset-history-container">
      <h2>Asset History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : logs.length === 0 ? (
        <p>No logs found for this asset.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Performed By</th>
              <th>Target User</th>
              <th>Assigned Date</th>
              <th>Returned Date</th>
              <th>Duration (days)</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.action}</td>
                <td>{log.performedBy?.name || '—'}</td>
                <td>{log.targetUser?.name || '—'}</td>
                <td>{log.assignedDate ? new Date(log.assignedDate).toLocaleDateString() : '—'}</td>
                <td>{log.returnedDate ? new Date(log.returnedDate).toLocaleDateString() : '—'}</td>
                <td>{log.duration || '—'}</td>
                <td>{log.note || '—'}</td>
                <td>{new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssetHistoryPage;
