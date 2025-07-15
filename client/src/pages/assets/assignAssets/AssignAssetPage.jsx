import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, assignAsset, updateRequestStatus } from '../../../slices/assetSlice';
import { fetchEmployees } from '../../../slices/employeeSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import './assignAssets.css';

const AssignAssetPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { assets, loading: assetLoading } = useSelector((state) => state.asset);
  const { list: employees, loading: empLoading } = useSelector((state) => state.employees);

  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Extract URL params if navigated from request page
  const searchParams = new URLSearchParams(location.search);
  const requestedUserId = searchParams.get('userId');
  const requestedAssetType = searchParams.get('assetType');
  const requestId = searchParams.get('requestId');

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchEmployees());

    // Prefill if navigated from request page
    if (requestedUserId) setSelectedEmployee(requestedUserId);
  }, [dispatch, requestedUserId]);

  const handleAssign = async () => {
    if (selectedAsset && selectedEmployee) {
      const result = await dispatch(assignAsset({ id: selectedAsset, userId: selectedEmployee }));

      if (assignAsset.fulfilled.match(result)) {
        // ✅ Update request status if present
        if (requestId) {
          await dispatch(updateRequestStatus({ id: requestId, status: 'approved' }));
        }
        alert('Asset assigned successfully!');
        navigate('/admin/assets/showRequest'); // Go back to request page
      }
    }
  };

  const availableAssets = assets.filter(
    (a) =>
      a.status?.toLowerCase() === 'available' &&
      (!requestedAssetType || a.type?.toLowerCase() === requestedAssetType.toLowerCase())
  );

  return (
    <div className="assign-page">
      <h2>Assign Asset to Employee</h2>

      <div className="form-group">
        <label>Choose Available Asset</label>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          disabled={assetLoading || availableAssets.length === 0}
        >
          <option value="">
            {assetLoading
              ? 'Loading assets...'
              : availableAssets.length === 0
              ? 'No available assets'
              : '-- Select Asset --'}
          </option>
          {availableAssets.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} ({a.serialNumber}) - {a.type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Choose Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          disabled={empLoading || employees.length === 0}
        >
          <option value="">
            {empLoading
              ? 'Loading employees...'
              : employees.length === 0
              ? 'No employees found'
              : '-- Select Employee --'}
          </option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>
      </div>

      <button
        className="assign-button"
        onClick={handleAssign}
        disabled={!selectedAsset || !selectedEmployee || assetLoading || empLoading}
      >
        {assetLoading || empLoading ? 'Processing...' : 'Assign Asset'}
      </button>
    </div>
  );
};

export default AssignAssetPage;
