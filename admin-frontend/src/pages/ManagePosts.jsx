import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const ManagePosts = () => {
  const services = [
    {
      id: 1,
      name: "Home Cleaning",
      category: "Cleaning",
      provider: "Suresh",
      price: "₹1500",
      rating: "4.5 ⭐",
      status: "Pending"
    },
    {
      id: 2,
      name: "Plumbing Repair",
      category: "Repair",
      provider: "Arun",
      price: "₹800",
      rating: "4.2 ⭐",
      status: "Approved"
    },
    {
      id: 3,
      name: "AC Service",
      category: "Maintenance",
      provider: "Ramesh",
      price: "₹1200",
      rating: "4.8 ⭐",
      status: "Pending"
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="content">
          <h2>Manage Services</h2>

          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.provider}</td>
                  <td>{service.price}</td>
                  <td>{service.rating}</td>
                  <td>{service.status}</td>
                  <td>
                    <button className="approve-btn">Approve</button>
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

export default ManagePosts;