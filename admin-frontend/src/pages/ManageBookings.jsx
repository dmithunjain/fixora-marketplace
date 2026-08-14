import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const ManageBookings = () => {
  const bookings = [
    { id: 1, user: "Ravi", service: "Home Cleaning", date: "12 Mar 2026", status: "Completed" },
    { id: 2, user: "Anjali", service: "AC Service", date: "15 Mar 2026", status: "Pending" },
    { id: 3, user: "Suresh", service: "Plumbing Repair", date: "18 Mar 2026", status: "Cancelled" }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="content">
          <h2>Manage Bookings</h2>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default ManageBookings;