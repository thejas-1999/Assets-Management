import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeProfile } from "../../../slices/employeeSlice";
import { useParams } from "react-router-dom";
import "./employeeProfilePage.css"; // external stylesheet

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { employeeProfile, loading, error } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    dispatch(getEmployeeProfile(id));
  }, [dispatch, id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!employeeProfile) return null;

  return (
    <div className="employee-profile-container">
      <h1 className="employee-name">{employeeProfile.name}'s Profile</h1>
      <p className="employee-info">Email: {employeeProfile.email}</p>
      <p className="employee-info">Designation: {employeeProfile.designation}</p>
      <p className="employee-info">
        Joined: {new Date(employeeProfile.createdAt).toLocaleDateString()}
      </p>

      <h2 className="section-title">Current Assets</h2>
      {employeeProfile.currentAssets?.length > 0 ? (
        <ul className="asset-list">
          {employeeProfile.currentAssets.map((asset, index) => (
            <li key={index} className="asset-item">
              {asset.name} ({asset.serialNumber})
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data-text">No current assets</p>
      )}

      <h2 className="section-title">Asset History</h2>
      {employeeProfile.assetHistory?.length > 0 ? (
        <table className="asset-history-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Assigned Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {employeeProfile.assetHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.assetName}</td>
                <td>{item.category}</td>
                <td>{item.serialNumber}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  {item.returnedDate
                    ? new Date(item.returnedDate).toLocaleDateString()
                    : "Not returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data-text">No history found</p>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
