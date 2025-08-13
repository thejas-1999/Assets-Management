import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssets,
  deleteAsset,
  returnAsset,
  downloadAssetsFile, // import this thunk from your slice
} from "../../../slices/assetSlice";
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

  // Utility to download blob files
  function downloadBlob(data, filename, mimeType) {
    const url = window.URL.createObjectURL(new Blob([data], { type: mimeType }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  const handleDownload = async (format) => {
    const action = await dispatch(downloadAssetsFile(format));
    if (downloadAssetsFile.fulfilled.match(action)) {
      const { data } = action.payload;
      const filename = `assets.${format === "excel" ? "xlsx" : "pdf"}`;
      const mimeType =
        format === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/pdf";
      downloadBlob(data, filename, mimeType);
    } else {
      alert("Download failed: " + action.payload);
    }
  };

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

  // Expand assets to one row per serial number
  const expandedAssets = assets.flatMap((asset) =>
    (asset.serialNumbers && asset.serialNumbers.length > 0
      ? asset.serialNumbers
      : ["—"]
    ).map((serial) => ({
      ...asset,
      serialNumbers: [serial],
      quantity: 1,
    }))
  );

  // Filter assets
  const filteredAssets = expandedAssets
    .filter((asset) => {
      const searchTarget = [
        asset.name,
        asset.category,
        ...(asset.serialNumbers || []),
      ]
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(searchTerm.toLowerCase());
    })
    .filter((asset) =>
      availabilityFilter === "all" ? true : asset.status === availabilityFilter
    )
    .filter((asset) =>
      categoryFilter === "all" ? true : asset.category === categoryFilter
    );

  // Pagination
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

          {/* Download buttons */}
          <button onClick={() => handleDownload("pdf")} style={{ marginLeft: "15px" }}>
            Download Assets PDF
          </button>
          <button onClick={() => handleDownload("excel")} style={{ marginLeft: "10px" }}>
            Download Assets Excel
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          className="search-box"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
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
          <option value="maintenance">Maintenance</option>
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

      {/* Table */}
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
                <th>Quantity</th>
                <th>Serial Number</th>
                <th>Purchase Date</th>
                <th>Purchase Value</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={`${asset._id}-${asset.serialNumbers[0]}`}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>1</td>
                  <td>{asset.serialNumbers[0]}</td>
                  <td>
                    {asset.purchaseDate
                      ? new Date(asset.purchaseDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {asset.purchaseValue
                      ? `₹${asset.purchaseValue.toLocaleString()}`
                      : "—"}
                  </td>
                  <td>{asset.status}</td>
                  <td>{asset.assignedTo ? asset.assignedTo.name : "—"}</td>
                  <td>
                    <button onClick={() => handleViewHistory(asset._id)}>
                      History
                    </button>

                    {asset.status !== "available" &&
                      asset.status !== "in-repair" &&
                      asset.status !== "maintenance" && (
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
              {paginatedAssets.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No matching assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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
