import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, deleteEmployee } from "../../../slices/employeeSlice";
import { useNavigate, Link } from "react-router-dom";
import "./employeeList.css";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((state) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const EMPLOYEES_PER_PAGE = 10;

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
      case "admin":
        return "admin-role";
      case "manager":
        return "manager-role";
      case "employee":
        return "employee-role";
      default:
        return "default-role";
    }
  };

  const filteredEmployees = list
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || emp.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase() || "";
      const valB = b[sortBy]?.toLowerCase() || "";
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * EMPLOYEES_PER_PAGE,
    currentPage * EMPLOYEES_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="employee-list-container">
      <div className="employee-header">
        <h2>Employee Management</h2>
        <div className="employee-actions">
          <button onClick={() => navigate("/admin/dashboard")}>⬅ Back</button>
          <button onClick={() => navigate("/admin/employees/register")}>
            ➕ Add Employee
          </button>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, email, designation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
        >
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
            <th onClick={() => handleSort("name")}>
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("email")}>
              Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("designation")}>
              Designation{" "}
              {sortBy === "designation" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length === 0 ? (
            <tr>
              <td colSpan="6">No employees found.</td>
            </tr>
          ) : (
            paginatedEmployees.map((emp) => (
              <tr
                key={emp._id}
                className="clickable-row"
                onClick={() => navigate(`/admin/employees/${emp._id}/profile`)}
              >
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>{emp.phone}</td>
                <td>
                  <span className={`role-badge ${getRoleColor(emp.role)}`}>
                    {emp.role}
                  </span>
                </td>
                <td
                  onClick={(e) => e.stopPropagation()} // stop row click
                >
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(emp._id);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp._id, emp.name);
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tbody>
          {paginatedEmployees.length === 0 ? (
            <tr>
              <td colSpan="6">No employees found.</td>
            </tr>
          ) : (
            paginatedEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <Link
                    to={`/admin/employees/${emp._id}/profile`}
                    className="text-blue-600 hover:underline"
                  >
                    {emp.name}
                  </Link>
                </td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>{emp.phone}</td>
                <td>
                  <span className={`role-badge ${getRoleColor(emp.role)}`}>
                    {emp.role}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(emp._id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(emp._id, emp.name)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
