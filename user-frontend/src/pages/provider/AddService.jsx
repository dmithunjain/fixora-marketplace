import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerServiceAPI } from "../../services/api";
import "./ProviderPanel.css";


const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function AddService() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [providerData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    price: "",
    originalPrice: "",
    discount: "",
    description: "",
    duration: "",
    availableDays: "",
    timing: "",
    availability: "",
    experience: "",
    highlights: "",
    image: null,
    imagePreview: null,
    availableDates: [],
    availableTimes: []
  });

  const [newDate, setNewDate] = useState("");
  const [newTimeStart, setNewTimeStart] = useState("");
  const [newTimeEnd, setNewTimeEnd] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadProviderData();
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      const { publicServiceAPI } = await import("../../services/api");
      const cats = await publicServiceAPI.getCategories();
      console.log("Categories loaded:", cats);
      if (cats && cats.length > 0) {
        setCategories(cats.filter(c => !c.parentId));
        const subs = cats.filter(c => c.parentId);
        setSubCategories(subs);
      } else {
        // Fallback to default categories if API returns empty
        setCategories([
          { _id: "1", name: "Home Cleaning", slug: "home-cleaning" },
          { _id: "2", name: "AC Repair", slug: "ac-repair" },
          { _id: "3", name: "Electrical", slug: "electrical" },
          { _id: "4", name: "Plumbing", slug: "plumbing" },
          { _id: "5", name: "Salon & Spa", slug: "salon-spa" },
          { _id: "6", name: "Appliance Repair", slug: "appliance-repair" },
          { _id: "7", name: "Pest Control", slug: "pest-control" },
          { _id: "8", name: "Carpenter", slug: "carpenter" },
          { _id: "9", name: "Painting", slug: "painting" },
          { _id: "10", name: "Gardening", slug: "gardening" }
        ]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      // Fallback on error
      setCategories([
        { _id: "1", name: "Home Cleaning", slug: "home-cleaning" },
        { _id: "2", name: "AC Repair", slug: "ac-repair" },
        { _id: "3", name: "Electrical", slug: "electrical" },
        { _id: "4", name: "Plumbing", slug: "plumbing" },
        { _id: "5", name: "Salon & Spa", slug: "salon-spa" },
        { _id: "6", name: "Appliance Repair", slug: "appliance-repair" },
        { _id: "7", name: "Pest Control", slug: "pest-control" },
        { _id: "8", name: "Carpenter", slug: "carpenter" },
        { _id: "9", name: "Painting", slug: "painting" },
        { _id: "10", name: "Gardening", slug: "gardening" }
      ]);
    }
  };

  const getSubCategories = (parentSlug) => {
    return subCategories.filter(sc => sc.parentId === parentSlug);
  };

  const loadProviderData = async () => {
    try {
      setLoading(false);
    } catch (err) {
      console.log("Provider data load error:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
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
    const file = e.target.files[0];
    if (file) {
      optimizeImage(file)
        .then((optimizedBase64) => {
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: optimizedBase64
          }));
        })
        .catch((err) => {
          setMessage({ type: "error", text: err.message || "Failed to process image" });
        });
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
  };

  const addDate = () => {
    if (newDate && !formData.availableDates.includes(newDate)) {
      setFormData(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, newDate].sort()
      }));
      setNewDate("");
    }
  };

  const removeDate = (date) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter(d => d !== date)
    }));
  };

  const addTimeSlot = () => {
    if (newTimeStart && newTimeEnd) {
      const newSlot = `${newTimeStart} - ${newTimeEnd}`;
      if (!formData.availableTimes.includes(newSlot)) {
        setFormData(prev => ({
          ...prev,
          availableTimes: [...prev.availableTimes, newSlot]
        }));
      }
      setNewTimeStart("");
      setNewTimeEnd("");
    }
  };

  const removeTimeSlot = (slot) => {
    setFormData(prev => ({
      ...prev,
      availableTimes: prev.availableTimes.filter(t => t !== slot)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category || !formData.price || !formData.description.trim()) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (formData.availableDates.length === 0) {
      setMessage({ type: "error", text: "Please add at least one available date" });
      return;
    }

    if (formData.availableTimes.length === 0) {
      setMessage({ type: "error", text: "Please add at least one time slot" });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const serviceData = {
        name: formData.title,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
        discount: parseInt(formData.discount) || 0,
        categoryId: formData.category,
        subCategoryId: formData.subCategory,
        duration: formData.duration,
        availableDays: formData.availableDays,
        timing: formData.timing,
        availability: formData.availability || [formData.availableDays, formData.timing].filter(Boolean).join(', '),
        experience: formData.experience ? formData.experience.split(',').map(h => h.trim()).filter(h => h) : [],
        highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()).filter(h => h) : (formData.experience ? formData.experience.split(',').map(h => h.trim()).filter(h => h) : []),
        images: formData.imagePreview ? [formData.imagePreview] : [],
        availableDates: formData.availableDates,
        availableTimes: formData.availableTimes
      };
      
      await providerServiceAPI.createService(serviceData);
      setMessage({ type: "success", text: "Service submitted for review! It will be live after admin approval." });
      
      setFormData({
        title: "",
        category: "",
        subCategory: "",
        price: "",
        originalPrice: "",
        discount: "",
        description: "",
        duration: "",
        availableDays: "",
        timing: "",
        availability: "",
        experience: "",
        highlights: "",
        image: null,
        imagePreview: null,
        availableDates: [],
        availableTimes: []
      });
      
      setTimeout(() => {
        navigate("/provider/my-services");
      }, 2000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add service. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="provider-layout">
        <ProviderSidebar providerData={null} />
        <main className="provider-main">
          <div className="provider-content">
            <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const completionScore = [
    formData.title.trim(),
    formData.category,
    formData.price,
    formData.description.trim(),
    formData.availableDays,
    formData.timing,
    formData.availableDates.length > 0,
    formData.availableTimes.length > 0,
    formData.imagePreview
  ].filter(Boolean).length;

  const completionPercent = Math.round((completionScore / 9) * 100);

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />

      <main className="provider-main">
        <div className="provider-content">
          <div className="add-service-hero">
            <div>
              <h1 className="page-title mb-1">Create Service Listing</h1>
              <p className="page-subtitle mb-0">Submit your service for admin approval, then publish it to a target page.</p>
            </div>
            <div className="add-service-progress">
              <span>Form Completion</span>
              <strong>{completionPercent}%</strong>
            </div>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
              {message.type === "success" ? <CheckIcon /> : <AlertIcon />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-service-grid">
            <section className="card add-service-main">
              <div className="card-body p-0">
                <div className="add-service-section">
                  <h3 className="add-service-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    Service Basics
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Service Title *</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Full Home Cleaning"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                          name="category"
                          className="form-select"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.slug}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Sub Category</label>
                        <select
                          name="subCategory"
                          className="form-select"
                          value={formData.subCategory}
                          onChange={handleChange}
                          disabled={!formData.category}
                        >
                          <option value="">Select sub category (optional)</option>
                          {getSubCategories(formData.category).map(sub => (
                            <option key={sub._id} value={sub.slug}>{sub.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          className="form-control"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="3 hrs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-section">
                  <h3 className="add-service-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Pricing
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">Price (₹) *</label>
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="449"
                          min="0"
                          step="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">Original Price (₹)</label>
                        <input
                          type="number"
                          name="originalPrice"
                          className="form-control"
                          value={formData.originalPrice}
                          onChange={handleChange}
                          placeholder="599"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">Discount (%)</label>
                        <input
                          type="number"
                          name="discount"
                          className="form-control"
                          value={formData.discount}
                          onChange={handleChange}
                          placeholder="25"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-section">
                  <h3 className="add-service-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Availability
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Available Days</label>
                        <input
                          type="text"
                          name="availableDays"
                          className="form-control"
                          value={formData.availableDays}
                          onChange={handleChange}
                          placeholder="Mon - Sun"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Timing</label>
                        <input
                          type="text"
                          name="timing"
                          className="form-control"
                          value={formData.timing}
                          onChange={handleChange}
                          placeholder="8:00 AM - 6:00 PM"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="form-label">Date Available *</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="date"
                        className="form-control"
                        style={{ maxWidth: '200px' }}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                      <button type="button" className="btn btn-primary" onClick={addDate}>
                        Add Date
                      </button>
                    </div>
                    <div className="slot-list">
                      {formData.availableDates.length > 0 ? formData.availableDates.map((date, index) => (
                        <span key={index} className="slot_chip slot_chip-date">
                          {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          <button type="button" onClick={() => removeDate(date)}>×</button>
                        </span>
                      )) : <p className="slot-empty">No dates added yet</p>}
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="form-label">Time Slots *</label>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={newTimeStart}
                        onChange={(e) => setNewTimeStart(e.target.value)}
                      />
                      <span className="text-muted">to</span>
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={newTimeEnd}
                        onChange={(e) => setNewTimeEnd(e.target.value)}
                      />
                      <button type="button" className="btn btn-primary" onClick={addTimeSlot}>
                        Add Time
                      </button>
                    </div>
                    <div className="slot-list">
                      {formData.availableTimes.length > 0 ? formData.availableTimes.map((slot, index) => (
                        <span key={index} className="slot_chip slot_chip-time">
                          {slot}
                          <button type="button" onClick={() => removeTimeSlot(slot)}>×</button>
                        </span>
                      )) : <p className="slot-empty">No time slots added yet</p>}
                    </div>
                  </div>
                </div>

                <div className="add-service-section">
                  <h3 className="add-service-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Description & Quality Notes
                  </h3>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                          name="description"
                          className="form-control"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Professional deep cleaning for your entire home including kitchen, bathrooms and furniture surfaces."
                          required
                          rows={4}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Experience Points (comma separated)</label>
                        <input
                          type="text"
                          name="experience"
                          className="form-control"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="Eco friendly chemicals, Trained professionals"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Highlights (optional)</label>
                        <input
                          type="text"
                          name="highlights"
                          className="form-control"
                          value={formData.highlights}
                          onChange={handleChange}
                          placeholder="Quality guaranteed, Safe for kids & pets"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("/provider/my-services")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit for Approval"}
                  </button>
                </div>
              </div>
            </section>

            <aside className="card add-service-side">
              <div className="card-body">
                <h3 className="add-service-side-title">Preview Card</h3>
                <div className="add-service-image-box">
                  {formData.imagePreview ? (
                    <div className="add-service-image-wrap">
                      <img src={formData.imagePreview} alt="Service preview" className="add-service-image" />
                      <button type="button" className="add-service-image-remove" onClick={removeImage}>×</button>
                    </div>
                  ) : (
                    <label htmlFor="service-image" className="add-service-image-placeholder">
                      <span className="add-service-image-icon">📷</span>
                      <span>Upload service image</span>
                      <small>PNG/JPG</small>
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="service-image"
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="add-service-preview">
                  <h4>{formData.title || "Service title preview"}</h4>
                  <p>{formData.description || "Your service description will appear here."}</p>
                  <div className="add-service-preview-meta">
                    <span>{formData.duration || "Duration"}</span>
                    <span>{formData.availableDays || "Days"}</span>
                    <span>{formData.timing || "Timing"}</span>
                  </div>
                  <div className="add-service-preview-price">
                    ₹{formData.price || 0}
                    {formData.originalPrice && <small>₹{formData.originalPrice}</small>}
                  </div>
                </div>

                <div className="add-service-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <p className="mb-0"><strong>Review Flow:</strong> Submit → Admin Approval → Admin Placement → Live on user page.</p>
                </div>
              </div>
            </aside>
          </form>

          <p className="add-service-footnote mt-3 text-center text-muted">
            Required: title, category, price, description, at least one date, and at least one time slot.
          </p>
        </div>
      </main>
    </div>
  );
}
