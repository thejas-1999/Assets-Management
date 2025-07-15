import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateAsset, fetchAssets } from "../../../slices/assetSlice";
import './assetEdit.css'

const AssetEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assets, loading, error } = useSelector((state) => state.asset);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serialNumber: "",
    specifications: "",
    status: "available",
  });

  useEffect(() => {
    const asset = assets.find((a) => a._id === id);
    if (!asset) {
      dispatch(fetchAssets());
    } else {
      setFormData({
        name: asset.name,
        type: asset.type,
        serialNumber: asset.serialNumber,
        specifications: asset.specifications || "",
        status: asset.status,
      });
    }
  }, [dispatch, id, assets]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAsset({ id, assetData: formData }))
      .unwrap()
      .then(() => navigate("/admin/assets"))
      .catch(() => {});
  };

  return (
    <div className="edit-asset-container">
      <h2>Edit Asset</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="asset-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Serial Number:
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Specifications:
          <input
            type="text"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
          </select>
        </label>

        <button type="submit">Update Asset</button>
      </form>
    </div>
  );
};

export default AssetEditPage;
