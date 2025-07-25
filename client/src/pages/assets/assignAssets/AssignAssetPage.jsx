import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, assignAsset, updateRequestStatus } from '../../../slices/assetSlice';
import { fetchEmployees } from '../../../slices/employeeSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './assignAssets.css';

const AssignAssetPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { assets, loading: assetLoading } = useSelector((state) => state.asset);
  const { list: employees, loading: empLoading } = useSelector((state) => state.employees);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const requestedUserId = searchParams.get('userId');
  const requestedAssetType = searchParams.get('assetType');
  const requestId = searchParams.get('requestId');

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (requestedUserId && employees.length > 0) {
      const prefillUser = employees.find((emp) => emp._id === requestedUserId);
      if (prefillUser) {
        setSelectedEmployee({
          value: prefillUser._id,
          label: `${prefillUser.name} (${prefillUser.email})`,
        });
      }
    }
  }, [requestedUserId, employees]);

  const handleAssign = async () => {
    if (selectedAsset && selectedEmployee) {
      const result = await dispatch(
        assignAsset({ id: selectedAsset.value, userId: selectedEmployee.value })
      );

      if (assignAsset.fulfilled.match(result)) {
        if (requestId) {
          await dispatch(updateRequestStatus({ id: requestId, status: 'approved' }));
        }
        alert('Asset assigned successfully!');
        navigate('/admin/assets/showRequest');
      }
    }
  };

  const availableAssets = assets.filter(
    (a) =>
      a.status?.toLowerCase() === 'available' &&
      (!requestedAssetType || a.type?.toLowerCase() === requestedAssetType.toLowerCase())
  );

  const assetOptions = availableAssets.map((a) => ({
    value: a._id,
    label: `${a.name} (${a.serialNumber}) - ${a.type}`,
  }));

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: `${emp.name} (${emp.email})`,
  }));

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '6px 4px',
      borderRadius: '12px',
      borderColor: state.isFocused ? '#667eea' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
      backgroundColor: '#fafbfc',
      fontSize: '16px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#667eea'
        : state.isFocused
        ? '#e0e7ff'
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: 12,
      fontSize: '16px',
      cursor: 'pointer',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: '12px',
      maxHeight: '300px',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '300px',
      overflowY: 'auto',
    }),
  };

  return (
    <div className="assign-page">
      <h2>Assign Asset to Employee</h2>

      <div className="form-group">
        <label>Choose Available Asset</label>
        <Select
          options={assetOptions}
          value={selectedAsset}
          onChange={setSelectedAsset}
          isLoading={assetLoading}
          isDisabled={assetLoading || assetOptions.length === 0}
          placeholder={assetLoading ? 'Loading assets...' : 'Select Asset'}
          styles={customSelectStyles}
          menuPlacement="auto"
        />
      </div>

      <div className="form-group">
        <label>Choose Employee</label>
        <Select
          options={employeeOptions}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
          isLoading={empLoading}
          isDisabled={empLoading || employeeOptions.length === 0}
          placeholder={empLoading ? 'Loading employees...' : 'Select Employee'}
          styles={customSelectStyles}
          menuPlacement="auto"
        />
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
