import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../../slices/employeeSlice";
import { useNavigate } from "react-router-dom";
import './employeeList.css'

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((state) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteEmployee(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/employees/edit/${id}`);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "admin-role";
      case "manager": return "manager-role";
      case "employee": return "employee-role";
      default: return "default-role";
    }
  };

  const filteredEmployees = list
    .filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || emp.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase() || "";
      const valB = b[sortBy]?.toLowerCase() || "";
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  return (
    <div className="employee-list-container">
      <div className="employee-header">
        <h2>Employee Management</h2>
        <div className="employee-actions">
          <button onClick={() => navigate("/admin/dashboard")}>⬅ Back</button>
          <button onClick={() => navigate("/admin/employees/register")}>➕ Add Employee</button>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, email, designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [col, order] = e.target.value.split("-");
            setSortBy(col);
            setSortOrder(order);
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="email-asc">Email (A-Z)</option>
          <option value="email-desc">Email (Z-A)</option>
          <option value="designation-asc">Designation (A-Z)</option>
          <option value="designation-desc">Designation (Z-A)</option>
        </select>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p className="error">{error}</p>}

      <table className="employee-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th onClick={() => handleSort("email")}>Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th onClick={() => handleSort("designation")}>Designation {sortBy === "designation" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr><td colSpan="6">No employees found.</td></tr>
          ) : (
            filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>{emp.phone}</td>
                <td>
                  <span className={`role-badge ${getRoleColor(emp.role)}`}>
                    {emp.role}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(emp._id)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp._id, emp.name)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
