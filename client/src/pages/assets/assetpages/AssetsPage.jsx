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
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleViewHistory = (id) => {
    navigate(`/admin/assets/history/${id}`);
  };

  // Filter logic
  const filteredAssets = assets
    .filter((asset) =>
      [asset.name, asset.category, asset.serialNumber]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((asset) =>
      availabilityFilter === "all" ? true : asset.status === availabilityFilter
    )
    .filter((asset) =>
      categoryFilter === "all" ? true : asset.category === categoryFilter
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueCategories = [...new Set(assets.map((a) => a.category))];

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

        <select
          value={availabilityFilter}
          onChange={(e) => {
            setAvailabilityFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
                <th>Category</th>
                <th>Serial No</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.serialNumber}</td>
                  <td>{asset.status}</td>
                  <td>{asset.assignedTo ? asset.assignedTo.name : "—"}</td>
                  <td>
                    <button onClick={() => handleViewHistory(asset._id)}>History</button>
                    {asset.status !== "available" && (
                      <button onClick={() => handleReturn(asset._id)}>Return</button>
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
              {paginatedAssets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No matching assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
