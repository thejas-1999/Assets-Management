import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssets, deleteAsset, returnAsset } from "../../../slices/assetSlice";
import { useNavigate } from "react-router-dom";
import "./assetPage.css";

const AssetsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assets, loading, error } = useSelector((state) => state.asset);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      dispatch(deleteAsset(id));
    }
  };

  const handleReturn = (id) => {
    if (window.confirm("Mark this asset as returned?")) {
      dispatch(returnAsset(id));
    }
  };

  const handleCreate = () => {
    navigate("/admin/assets/create");
  };

  const handleEdit = (id) => {
    navigate(`/admin/assets/edit/${id}`);
  };

  const filteredAssets = assets.filter((asset) =>
    [asset.name, asset.type, asset.serialNumber]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="assets-container">
      <div className="header-section">
        <h2 className="page-title">Assets</h2>
        <div>
          <button onClick={handleCreate}>+ Create Asset</button>
          <button onClick={() => navigate("/admin/assets/assign")}>
            Assign Asset to Employee
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="table-wrapper">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Serial No</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.name}</td>
                  <td>{asset.type}</td>
                  <td>{asset.serialNumber}</td>
                  <td>{asset.status}</td>
                  <td>{asset.assignedTo ? asset.assignedTo.name : "—"}</td>
                  <td>
                    {asset.status !== "available" && (
                      <button onClick={() => handleReturn(asset._id)}>
                        Return
                      </button>
                    )}
                    <button onClick={() => handleEdit(asset._id)}>Edit</button>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      style={{ backgroundColor: "red", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No matching assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
