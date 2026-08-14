import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const ManageUsers = () => {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "Ravi Kumar",
      email: "ravi@gmail.com",
      phone: "9876543210",
      location: "Mangalore",
      role: "User",
      status: "Active"
    },
    {
      id: 2,
      name: "Suresh Shetty",
      email: "suresh@gmail.com",
      phone: "9123456780",
      location: "Udupi",
      role: "Provider",
      status: "Blocked"
    },
    {
      id: 3,
      name: "Anjali Rao",
      email: "anjali@gmail.com",
      phone: "9988776655",
      location: "Bangalore",
      role: "User",
      status: "Active"
    }
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="content">
          <h2>Manage Users</h2>

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px", marginBottom: "15px", width: "250px" }}
          />

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.location}</td>
                  <td>{user.role}</td>
                  <td>
                    <span style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      background: user.status === "Active" ? "#22c55e" : "#ef4444",
                      color: "white"
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="approve-btn">Block</button>
                    <button className="delete-btn" style={{ marginLeft: "5px" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;