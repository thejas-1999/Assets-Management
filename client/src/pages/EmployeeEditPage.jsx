import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById, updateEmployee } from '../slices/employeeSlice';

const EmployeeEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employee: selectedEmployee, loading, error } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || '',
        email: selectedEmployee.email || '',
        designation: selectedEmployee.designation || '',
        phone: selectedEmployee.phone || '',
        role: selectedEmployee.role || '',
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateEmployee({ id, data: formData }));
    navigate('/admin/employeeList');
  };

  return (
    <div>
      <h2>Edit Employee</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">SuperAdmin</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EmployeeEditPage;
