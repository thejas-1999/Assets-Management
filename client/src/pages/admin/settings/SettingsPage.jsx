// pages/Admin/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateAssetTypes } from "../../../slices/settingSlice";
import "./settingsPage.css";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { assetTypes, loading } = useSelector((state) => state.settings);
  const [newType, setNewType] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    setTypes(assetTypes);
  }, [assetTypes]);

  const handleAddType = () => {
    if (newType && !types.includes(newType)) {
      const updated = [...types, newType];
      setTypes(updated);
      dispatch(updateAssetTypes(updated));
      setNewType("");
    }
  };

  const handleDeleteType = (typeToDelete) => {
    const updated = types.filter((type) => type !== typeToDelete);
    setTypes(updated);
    dispatch(updateAssetTypes(updated));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddType();
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h2 className="settings-title">Asset Type Configuration</h2>
      
      <div className="add-type-section">
        <div className="add-type-form">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new asset type (e.g., Laptop, Monitor, Phone)"
            className="type-input"
          />
          <button 
            onClick={handleAddType} 
            className="add-btn"
            disabled={!newType.trim() || types.includes(newType)}
          >
            ➕ Add Type
          </button>
        </div>
      </div>

      <div className="types-container">
        <h3 className="types-header">Current Asset Types</h3>
        
        {types.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-message">No asset types configured</div>
            <div className="empty-submessage">Add your first asset type above to get started</div>
          </div>
        ) : (
          <ul className="types-list">
            {types.map((type, index) => (
              <li key={index} className="type-item">
                <span className="type-name">{type}</span>
                <button 
                  onClick={() => handleDeleteType(type)} 
                  className="delete-btn"
                  title={`Delete ${type}`}
                >
                  🗑️ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;