import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssetLogsById } from "../../../slices/assetLogSlice";
import {
  fetchAssets,
  startMaintenance,
  completeMaintenance,
} from "../../../slices/assetSlice";
import "./assetHistory.css";

const AssetHistoryPage = () => {
  const { assetId } = useParams();
  const dispatch = useDispatch();

  const assets = useSelector((state) => state.asset.assets);
  const loading = useSelector((state) => state.asset.loading);
  const error = useSelector((state) => state.asset.error);

  const {
    logs,
    loading: logsLoading,
    error: logsError,
  } = useSelector((state) => state.assetLogs);

  const asset = assets.find((a) => a._id === assetId);

  const [maintenanceDesc, setMaintenanceDesc] = useState("");
  const [completeDays, setCompleteDays] = useState("");
  const [completeCost, setCompleteCost] = useState("");
  const [completeDesc, setCompleteDesc] = useState("");

  useEffect(() => {
    if (!asset) dispatch(fetchAssets());
    dispatch(fetchAssetLogsById(assetId));
  }, [dispatch, assetId, asset]);

  const handleStartMaintenance = () => {
    if (!maintenanceDesc.trim()) {
      alert("Please enter a description");
      return;
    }
    dispatch(startMaintenance({ id: assetId, description: maintenanceDesc }));
    setMaintenanceDesc("");
  };

  const handleCompleteMaintenance = () => {
    if (!completeDays || !completeCost) {
      alert("Please enter days taken and cost");
      return;
    }
    dispatch(
      completeMaintenance({
        id: assetId,
        daysTaken: Number(completeDays),
        cost: Number(completeCost),
        description: completeDesc,
      })
    );
    setCompleteDays("");
    setCompleteCost("");
    setCompleteDesc("");
  };

 // In your download handlers
const downloadExcel = () => {
  window.open(`/api/assets/${assetId}/logs/download/excel`, "_blank");
};

const downloadPDF = () => {
  window.open(`/api/assets/${assetId}/logs/download/pdf`, "_blank");
};


  return (
    <div className="asset-history-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Asset History</h2>
        <div>
          <button
            style={{ marginRight: 10 }}
            onClick={downloadExcel}
          >
            Download Excel
          </button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      {loading && !asset ? (
        <p>Loading asset details...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : asset ? (
        <div className="asset-details">
          <h3>{asset.name}</h3>
          <p><strong>Category:</strong> {asset.category}</p>
          <p><strong>Serial Numbers:</strong> {asset.serialNumbers.join(", ")}</p>
          <p><strong>Specifications:</strong> {asset.specifications}</p>
          <p><strong>Purchase Date:</strong> {new Date(asset.purchaseDate).toLocaleDateString()}</p>
          <p><strong>Purchase Value:</strong> ₹{asset.purchaseValue}</p>
          <p>
            <strong>Warranty:</strong>{" "}
            {asset.hasWarranty
              ? `${new Date(asset.warrantyStartDate).toLocaleDateString()} - ${new Date(
                  asset.warrantyEndDate
                ).toLocaleDateString()}`
              : "No Warranty"}
          </p>
          <p><strong>Status:</strong> {asset.status}</p>
        </div>
      ) : null}

      <h3>Usage History</h3>
      {logsLoading ? (
        <p>Loading usage logs...</p>
      ) : logsError ? (
        <p style={{ color: "red" }}>{logsError}</p>
      ) : logs.length === 0 ? (
        <p>No usage logs found for this asset.</p>
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
                <td>{log.performedBy?.name || "—"}</td>
                <td>{log.targetUser?.name || "—"}</td>
                <td>{log.assignedDate ? new Date(log.assignedDate).toLocaleDateString() : "—"}</td>
                <td>{log.returnedDate ? new Date(log.returnedDate).toLocaleDateString() : "—"}</td>
                <td>{log.duration || "—"}</td>
                <td>{log.note || "—"}</td>
                <td>{new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Maintenance History</h3>
      {loading && !asset ? (
        <p>Loading maintenance logs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : asset?.maintenanceLogs?.length === 0 ? (
        <p>No maintenance records found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Maintenance Date</th>
              <th>Days Taken</th>
              <th>Cost</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {asset?.maintenanceLogs?.map((log, index) => {
              const isCompleted = log.daysTaken != null && log.cost != null;
              return (
                <tr key={index}>
                  <td>{new Date(log.maintenanceDate).toLocaleDateString()}</td>
                  <td>{isCompleted ? log.daysTaken : "—"}</td>
                  <td>{isCompleted ? `₹${log.cost}` : "—"}</td>
                  <td>
                    <strong>Status:</strong> {isCompleted ? "Completed" : "Repairing"}
                    <br />
                    {log.description || (isCompleted ? "—" : "Maintenance in progress")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Maintenance Actions */}
      <div style={{ marginTop: 30 }}>
        <h3>Start Maintenance</h3>
        <textarea
          rows={3}
          placeholder="Maintenance description"
          value={maintenanceDesc}
          onChange={(e) => setMaintenanceDesc(e.target.value)}
          style={{ width: "100%" }}
          disabled={asset?.status === "maintenance"}
        />
        <button
          onClick={handleStartMaintenance}
          disabled={loading || asset?.status === "maintenance"}
        >
          Start Maintenance
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Complete Maintenance</h3>
        <input
          type="number"
          placeholder="Days Taken"
          value={completeDays}
          onChange={(e) => setCompleteDays(e.target.value)}
          style={{ marginRight: 10 }}
          disabled={asset?.status !== "maintenance"}
        />
        <input
          type="number"
          placeholder="Cost"
          value={completeCost}
          onChange={(e) => setCompleteCost(e.target.value)}
          style={{ marginRight: 10 }}
          disabled={asset?.status !== "maintenance"}
        />
        <input
          type="text"
          placeholder="Description"
          value={completeDesc}
          onChange={(e) => setCompleteDesc(e.target.value)}
          style={{ marginRight: 10 }}
          disabled={asset?.status !== "maintenance"}
        />
        <button
          onClick={handleCompleteMaintenance}
          disabled={loading || asset?.status !== "maintenance"}
        >
          Complete Maintenance
        </button>
      </div>
    </div>
  );
};

export default AssetHistoryPage;
