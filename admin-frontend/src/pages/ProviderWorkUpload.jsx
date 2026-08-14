import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workproofAPI } from "../services/paymentAPI";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/provider-work-upload.css";

const ProviderWorkUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingId: "",
    providerId: "",
    providerName: "",
    serviceName: "",
    completionDate: "",
    description: "",
  });

  const [workImage, setWorkImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const serviceOptions = ["Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning", "Mechanics"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWorkImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!workImage) {
        throw new Error("Please upload a work proof image");
      }

      const uploadFormData = new FormData();
      uploadFormData.append("bookingId", formData.bookingId);
      uploadFormData.append("providerId", formData.providerId);
      uploadFormData.append("providerName", formData.providerName);
      uploadFormData.append("serviceName", formData.serviceName);
      uploadFormData.append("completionDate", formData.completionDate);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("workImage", workImage);

      const result = await workproofAPI.uploadWorkProof(uploadFormData);

      setMessage("Work proof uploaded successfully!");
      setFormData({
        bookingId: "",
        providerId: "",
        providerName: "",
        serviceName: "",
        completionDate: "",
        description: "",
      });
      setWorkImage(null);
      setImagePreview(null);

      // Redirect after success
      setTimeout(() => {
        navigate("/work-verification");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to upload work proof");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <div className="work-upload-container">
            <div className="work-upload-header">
              <h1>📸 Upload Work Proof</h1>
              <p>Submit proof of completed work for verification</p>
            </div>

            <form onSubmit={handleSubmit} className="work-upload-form">
              <div className="form-section">
                <h2>Booking & Provider Information</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="providerId">Provider ID *</label>
                    <input
                      type="text"
                      id="providerId"
                      name="providerId"
                      value={formData.providerId}
                      onChange={handleInputChange}
                      placeholder="PROV-XXXXX"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="providerName">Provider Name *</label>
                    <input
                      type="text"
                      id="providerName"
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookingId">Booking ID *</label>
                    <input
                      type="text"
                      id="bookingId"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleInputChange}
                      placeholder="BOOK-XXXXX"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="serviceName">Service Type *</label>
                    <select
                      id="serviceName"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Service</option>
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Work Details</h2>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="completionDate">Completion Date *</label>
                    <input
                      type="datetime-local"
                      id="completionDate"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Work Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the work you completed..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Work Proof Image *</h2>

                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Work Proof Preview" className="preview-image" />
                      <button
                        type="button"
                        className="btn-change-image"
                        onClick={() => document.getElementById("workImage").click()}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => document.getElementById("workImage").click()}>
                      <div className="upload-icon">📷</div>
                      <h3>Upload Work Proof Image</h3>
                      <p>Click to select or drag and drop</p>
                      <p className="file-info">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="workImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Uploading..." : "Submit Work Proof"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderWorkUpload;
