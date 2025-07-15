import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsset } from '../../../slices/assetSlice';
import { useNavigate } from 'react-router-dom';
import './assetCreate.css'; // Import the external CSS

const AssetCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.asset);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    specifications: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createAsset(formData));
    if (!result.error) {
      navigate('/admin/assets');
    }
  };

  return (
    <div className="asset-form-container">
      <h2 className="form-title">Create New Asset</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="asset-form">
        <div className="form-group">
          <label htmlFor="name">Asset Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter asset name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Asset Type</label>
          <input
            type="text"
            name="type"
            id="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Laptop, Monitor, Keyboard"
          />
        </div>

        <div className="form-group">
          <label htmlFor="serialNumber">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            id="serialNumber"
            required
            value={formData.serialNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter serial number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specifications">Specifications</label>
          <textarea
            name="specifications"
            id="specifications"
            rows="4"
            value={formData.specifications}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter detailed specifications (optional)"
          />
        </div>

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Creating...' : 'Create Asset'}
        </button>
      </form>
    </div>
  );
};

export default AssetCreatePage;