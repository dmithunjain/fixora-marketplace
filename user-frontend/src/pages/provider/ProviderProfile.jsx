import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerAPI } from "../../services/api";
import "./ProviderPanel.css";

const MyLocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="22" x2="21" y2="22"></line>
    <line x1="6" y1="18" x2="6" y2="11"></line>
    <line x1="10" y1="18" x2="10" y2="11"></line>
    <line x1="14" y1="18" x2="14" y2="11"></line>
    <line x1="18" y1="18" x2="18" y2="11"></line>
    <polygon points="12 2 20 7 4 7"></polygon>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export default function ProviderProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const response = await providerAPI.getProfile();
      const data = response.data || {};
      setProviderData(data);
      setEditForm(data);
    } catch (err) {
      console.log("Using stored data");
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);
      setEditForm(stored);
    } finally {
      setLoading(false);
    }
  };

  const maskedAccountNumber = (accNo) => {
    if (!accNo) return "Not Added";
    return accNo.slice(0, 4) + "****" + accNo.slice(-4);
  };

  const copyLocationFromUser = () => {
    try {
      const userLocation = localStorage.getItem('fixoraLocation');
      if (userLocation) {
        const location = JSON.parse(userLocation);
        setProviderData({ ...providerData, location: location });
        setEditForm({ ...editForm, location: location });
        alert("Location copied from your user account!");
      } else {
        alert("No location found in your user account. Please set location in the user navbar first.");
      }
    } catch (err) {
      console.error("Error copying location:", err);
      alert("Failed to copy location");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await providerAPI.updateProfile(editForm);
      setProviderData(editForm);
      localStorage.setItem("providerData", JSON.stringify(editForm));
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
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

  const profile = providerData || {};
  const bankStatus = profile.bankDetails?.verificationStatus || profile.bankDetailsStatus;
  const isBankVerified = bankStatus === "verified";
  const isEligibleForPayouts = !!profile.bankDetails?.isVerified;

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header profile-header-row">
            <div>
              <h1 className="page-title">Profile Details</h1>
              <p className="page-subtitle">Manage your personal and professional information</p>
            </div>
            <div className="d-flex gap-2">
              {editMode && (
                <button className="btn btn-success" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              )}
              <button className="btn btn-primary" onClick={() => editMode ? setEditMode(false) : setEditMode(true)}>
                <EditIcon />
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          <div className={`profile-payout-banner ${isEligibleForPayouts ? 'enabled' : 'pending'}`}>
            <strong>{isEligibleForPayouts ? '✓ Payouts Enabled' : '⏳ Payout Verification Pending'}</strong>
            <span>
              {isEligibleForPayouts
                ? 'You are eligible to receive payments from users.'
                : 'Add valid bank + UPI details and wait for admin approval to receive payments.'}
            </span>
          </div>

          {/* Section 1: Personal Details */}
          <div className="profile-section">
            <div className="card bg-white">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Personal Details</h3>
              </div>
              <div className="card-body">
                <div className="d-flex gap-4 align-items-start flex-wrap">
                  <div className="profile-avatar-large bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ minWidth: 80, height: 80 }}>
                    <UserIcon />
                  </div>
                  <div className="flex-1">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Full Name</label>
                          <div className="profile-value">{profile.fullName || profile.businessName || "Not provided"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Email</label>
                          <div className="profile-value">{profile.email || "Not provided"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Phone</label>
                          <div className="profile-value">{profile.phone || profile.mobile || "Not provided"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Gender</label>
                          <div className="profile-value">{profile.gender || "Not specified"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Service Category</label>
                          <div className="profile-value">{profile.serviceCategory || "Not specified"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-field mb-0">
                          <label className="profile-label">Years of Experience</label>
                          <div className="profile-value">{profile.experience ? `${profile.experience} years` : "Not specified"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address Details */}
          <div className="profile-section">
            <div className="card bg-white">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Address Details</h3>
                {!editMode && (
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={copyLocationFromUser}
                  >
                    <MyLocationIcon />
                    Copy from User
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="mb-4 p-3 rounded" style={{ background: editMode ? '#fff3cd' : '#f0f9ff', border: editMode ? '2px dashed #ffc107' : '1px solid #e0f2fe' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <MapPinIcon />
                      <strong style={{ color: '#0369a1' }}>Service Location</strong>
                    </div>
                  </div>
                   
                  {editMode ? (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label mb-1">State *</label>
                        <select
                          value={editForm.location?.state || ''}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            location: { ...editForm.location, state: e.target.value, district: '', city: '' } 
                          })}
                          className="form-control"
                        >
                          <option value="">Select State</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label mb-1">District *</label>
                        <input
                          type="text"
                          value={editForm.location?.district || ''}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            location: { ...editForm.location, district: e.target.value } 
                          })}
                          placeholder="Enter district"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label mb-1">City/Area *</label>
                        <input
                          type="text"
                          value={editForm.location?.city || ''}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            location: { ...editForm.location, city: e.target.value } 
                          })}
                          placeholder="Enter city"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label mb-1">Pincode</label>
                        <input
                          type="text"
                          value={editForm.location?.pincode || ''}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            location: { ...editForm.location, pincode: e.target.value } 
                          })}
                          placeholder="Enter pincode"
                          maxLength={6}
                          className="form-control"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2">
                      <div className="col-6"><strong>State:</strong> {profile.location?.state || 'Not set'}</div>
                      <div className="col-6"><strong>District:</strong> {profile.location?.district || 'Not set'}</div>
                      <div className="col-6"><strong>City:</strong> {profile.location?.city || 'Not set'}</div>
                      <div className="col-6"><strong>Pincode:</strong> {profile.location?.pincode || 'Not set'}</div>
                    </div>
                  )}
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Address</label>
                      <div className="profile-value">
                        {typeof profile.address === 'string' 
                          ? profile.address 
                          : profile.address?.address || profile.address?.line1 || profile.addressLine1 || "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">City</label>
                      <div className="profile-value">{profile.city || profile.address?.city || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">State</label>
                      <div className="profile-value">{profile.state || profile.address?.state || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Pincode</label>
                      <div className="profile-value">{profile.pincode || profile.address?.pincode || profile.zipCode || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Details */}
          <div className="profile-section">
            <div className="card bg-white">
              <div className="card-header">
                <h3 className="card-title mb-0">Professional Details</h3>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Service Category</label>
                      <div className="profile-value">{profile.serviceCategory || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Skills</label>
                      <div className="profile-value">{profile.skills?.join(", ") || profile.skills || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Years of Experience</label>
                      <div className="profile-value">{profile.experience ? `${profile.experience} years` : "Not specified"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profile-field mb-0">
                      <label className="profile-label">Availability</label>
                      <div className="profile-value">{profile.availability || profile.availabilityType || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Bank Details */}
          <div className="profile-section">
            <div className="card bg-white">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Bank Details</h3>
                <span className={`badge ${isBankVerified ? 'badge-success' : bankStatus === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {isBankVerified ? 'Verified' : bankStatus === 'rejected' ? 'Rejected' : 'Pending'}
                </span>
              </div>
              <div className="card-body">
                {profile.bankDetails?.accountNumber || profile.bankAccountNumber ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">Account Holder Name</label>
                        <div className="profile-value">{profile.bankDetails?.accountHolderName || profile.accountHolderName || "-"}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">Account Number</label>
                        <div className="profile-value">{maskedAccountNumber(profile.bankDetails?.accountNumber || profile.bankAccountNumber)}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">IFSC Code</label>
                        <div className="profile-value">{profile.bankDetails?.ifscCode || profile.ifscCode || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">Bank Name</label>
                        <div className="profile-value">{profile.bankDetails?.bankName || profile.bankName || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">Bank Mobile</label>
                        <div className="profile-value">{profile.bankDetails?.mobileNumber || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="profile-field mb-0">
                        <label className="profile-label">UPI ID</label>
                        <div className="profile-value">{profile.upiDetails?.upiId || profile.upiId || "Not provided"}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <BankIcon />
                    </div>
                    <p className="text-muted mb-0">No bank details added. Please add your bank account details in the Wallet section.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Verification Status */}
          <div className="profile-section">
            <div className="card bg-white">
              <div className="card-header">
                <h3 className="card-title mb-0">Verification Status</h3>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: 'var(--bg-page)' }}>
                      <div className="verification-item-icon">
                        <ShieldIcon />
                      </div>
                      <div>
                        <div className="verification-label">Account Status</div>
                        <span className={`badge ${profile.isApproved || profile.isVerified ? 'badge-success' : 'badge-warning'} mt-1`}>
                          {profile.isApproved || profile.isVerified ? 'Approved' : 'Pending Approval'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: 'var(--bg-page)' }}>
                      <div className="verification-item-icon">
                        <BankIcon />
                      </div>
                      <div>
                        <div className="verification-label">Bank Verification</div>
                        <span className={`badge ${isBankVerified ? 'badge-success' : bankStatus === 'rejected' ? 'badge-danger' : 'badge-warning'} mt-1`}>
                          {isBankVerified ? 'Verified' : bankStatus === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: 'var(--bg-page)' }}>
                      <div className="verification-item-icon">
                        <CheckCircleIcon />
                      </div>
                      <div>
                        <div className="verification-label">KYC Status</div>
                        <span className={`badge ${profile.kycVerified ? 'badge-success' : 'badge-warning'} mt-1`}>
                          {profile.kycVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
