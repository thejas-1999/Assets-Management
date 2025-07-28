import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsset } from '../../../slices/assetSlice';
import { useNavigate } from 'react-router-dom';
import './assetCreate.css';

const AssetCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    serialNumber: '',
    specifications: '',
  });

  const { loading, error } = useSelector((state) => state.asset);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAsset(formData))
      .unwrap()
      .then(() => navigate('/admin/assets'))
      .catch((err) => console.error('Asset creation failed:', err));
  };

  return (
    <div className="asset-create-container">
      <h2>Create New Asset</h2>
      {error && <p className="error">{error}</p>}
      <form className="asset-form" onSubmit={handleSubmit}>
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
            placeholder="e.g., HP Laptop"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Asset Category</label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select a category</option>
            <option value="Laptop">Laptop</option>
            <option value="Mouse">Mouse</option>
            <option value="Keyboard">Keyboard</option>
            <option value="Mobile Phone">Mobile Phone</option>
            <option value="Monitor">Monitor</option>
            <option value="Tablet">Tablet</option>
            <option value="Other">Other</option>
          </select>
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
            placeholder="e.g., SN12345678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specifications">Specifications</label>
          <textarea
            name="specifications"
            id="specifications"
            value={formData.specifications}
            onChange={handleChange}
            className="form-textarea"
            placeholder="e.g., 8GB RAM, 512GB SSD"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Asset'}
        </button>
      </form>
    </div>
  );
};

export default AssetCreatePage;
