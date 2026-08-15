import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerServiceAPI } from "../../services/api";
import "./ProviderPanel.css";

export default function EditService() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providerData, setProviderData] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    duration: "",
    imagePreview: "",
    imageFile: null,
  });

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
    setProviderData(stored);
    loadService();
  // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [id, navigate]);

  const loadService = async () => {
    try {
      const res = await providerServiceAPI.getService(id);
      const service = res?.data || res;
      setFormData({
        title: service.title || service.name || "",
        description: service.description || "",
        price: service.price || "",
        categoryId: service.categoryId || service.category || "",
        duration: service.duration || "",
        imagePreview: service.images?.[0] || service.image || "",
        imageFile: null,
      });
    } catch (err) {
      setMessage({ type: "error", text: "Unable to load service" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const optimizeImage = (file) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxSide = 1600;

        if (width > height && width > maxSide) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        } else if (height >= width && height > maxSide) {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Unable to process image"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > 1_600_000 && quality > 0.45) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Invalid image file"));
      };

      img.src = objectUrl;
    });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    optimizeImage(file)
      .then((optimizedBase64) => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: optimizedBase64,
        }));
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message || "Failed to process image" });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = {
        title: formData.title,
        name: formData.title,
        description: formData.description,
        price: Number(formData.price) || 0,
        categoryId: formData.categoryId,
        category: formData.categoryId,
        duration: formData.duration,
        image: formData.imagePreview || "",
        images: formData.imagePreview ? [formData.imagePreview] : [],
      };
      await providerServiceAPI.updateService(id, payload);
      setMessage({ type: "success", text: "Service updated successfully." });
      setTimeout(() => navigate("/provider/my-services"), 900);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update service" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="provider-layout">
        <ProviderSidebar providerData={providerData} />
        <main className="provider-main">
          <div className="provider-content">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header">
            <h1 className="page-title">Edit Service</h1>
            <p className="page-subtitle">Update details and image for your service listing</p>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
              {message.text}
            </div>
          )}

          <div className="card">
            <div className="card-body edit-service-wrap">
              <form onSubmit={handleSubmit} className="edit-service-grid">
                <section className="edit-service-section">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input className="form-input" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input type="number" className="form-input" name="price" value={formData.price} onChange={handleChange} min="0" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input className="form-input" name="categoryId" value={formData.categoryId} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input className="form-input" name="duration" value={formData.duration} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} />
                  </div>
                </section>

                <aside className="edit-service-side">
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Service Image</label>
                    <div className="edit-image-box">
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Service" className="edit-image-preview" />
                      ) : (
                        <div className="edit-image-empty">No image selected</div>
                      )}
                    </div>
                  </div>
                  <input id="edit-service-image" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                  <label htmlFor="edit-service-image" className="btn btn-outline edit-image-btn">
                    Change Image
                  </label>
                </aside>

                <div className="add-service-actions edit-service-actions">
                  <button type="button" className="btn btn-outline" onClick={() => navigate("/provider/my-services")}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
