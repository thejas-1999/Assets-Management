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
    specifications: '',
    purchaseDate: '',
    purchaseValue: '',
    quantity: 1,
    serialNumbers: [''], // Start with one field
    hasWarranty: false,
    warrantyStartDate: '',
    warrantyEndDate: '',
  });

  const { loading, error } = useSelector((state) => state.asset);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle serial number array change
  const handleSerialNumberChange = (index, value) => {
    const updated = [...formData.serialNumbers];
    updated[index] = value;
    setFormData({ ...formData, serialNumbers: updated });
  };

  // Adjust serialNumbers array when quantity changes
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    let updatedSerials = [...formData.serialNumbers];

    if (qty > updatedSerials.length) {
      updatedSerials = [...updatedSerials, ...Array(qty - updatedSerials.length).fill('')];
    } else if (qty < updatedSerials.length) {
      updatedSerials = updatedSerials.slice(0, qty);
    }

    setFormData({
      ...formData,
      quantity: qty,
      serialNumbers: updatedSerials,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.serialNumbers.length !== formData.quantity) {
      alert('Number of serial numbers must match quantity');
      return;
    }

    // If no warranty, clear warranty dates
    let submitData = { ...formData };
    if (!formData.hasWarranty) {
      submitData.warrantyStartDate = '';
      submitData.warrantyEndDate = '';
    }

    dispatch(createAsset(submitData))
      .unwrap()
      .then(() => navigate('/admin/assets'))
      .catch((err) => console.error('Asset creation failed:', err));
  };

  return (
    <div className="asset-create-container">
      <h2>Create New Asset</h2>
      {error && <p className="error">{error}</p>}

      <form className="asset-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Asset Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., HP Laptop"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Asset Category</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
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

        {/* Specifications */}
        <div className="form-group">
          <label>Specifications</label>
          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            placeholder="e.g., 8GB RAM, 512GB SSD"
          />
        </div>

        {/* Purchase Date */}
        <div className="form-group">
          <label>Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            required
            value={formData.purchaseDate}
            onChange={handleChange}
          />
        </div>

        {/* Purchase Value */}
        <div className="form-group">
          <label>Purchase Value</label>
          <input
            type="number"
            name="purchaseValue"
            required
            value={formData.purchaseValue}
            onChange={handleChange}
            placeholder="e.g., 50000"
          />
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            required
            value={formData.quantity}
            onChange={handleQuantityChange}
          />
        </div>

        {/* Serial Numbers */}
        {formData.serialNumbers.map((sn, index) => (
          <div className="form-group" key={index}>
            <label>Serial Number {index + 1}</label>
            <input
              type="text"
              value={sn}
              required
              onChange={(e) => handleSerialNumberChange(index, e.target.value)}
              placeholder={`Serial ${index + 1}`}
            />
          </div>
        ))}

        {/* Warranty */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="hasWarranty"
              checked={formData.hasWarranty}
              onChange={handleChange}
            />{' '}
            Has Warranty
          </label>
        </div>

        {formData.hasWarranty && (
          <>
            <div className="form-group">
              <label>Warranty Start Date</label>
              <input
                type="date"
                name="warrantyStartDate"
                value={formData.warrantyStartDate}
                onChange={handleChange}
                required={formData.hasWarranty}
              />
            </div>

            <div className="form-group">
              <label>Warranty End Date</label>
              <input
                type="date"
                name="warrantyEndDate"
                value={formData.warrantyEndDate}
                onChange={handleChange}
                required={formData.hasWarranty}
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Asset'}
        </button>
      </form>
    </div>
  );
};

export default AssetCreatePage;
