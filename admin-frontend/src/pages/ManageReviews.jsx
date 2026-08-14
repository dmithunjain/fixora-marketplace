import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const ManageReviews = () => {
  const reviews = [
    { id: 1, user: "Ravi", rating: "5 ⭐", comment: "Excellent Service!" },
    { id: 2, user: "Anjali", rating: "4 ⭐", comment: "Very good experience" },
    { id: 3, user: "Suresh", rating: "2 ⭐", comment: "Service was late" }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="content">
          <h2>User Reviews</h2>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.user}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>
                    <button className="delete-btn">Remove</button>
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

export default ManageReviews;