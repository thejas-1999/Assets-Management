import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import './employeeRegister.css'
 
const EmployeeRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.employees);
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    phone: '',
    role: 'user',
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
 
    dispatch(createEmployee(formData)).then((res) => {
      if (!res.error) navigate('/admin/employeeList');
    });
  };
 
  return (
    <div className="register-form">
      <h2>Register New Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
 
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
 
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
 
      <button
        onClick={() => navigate('/admin/employeeList')}
        style={{ marginTop: '10px' }}
      >
        ⬅ Back to Employee List
      </button>
    </div>
  );
};
 
export default EmployeeRegisterPage;