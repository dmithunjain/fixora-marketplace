import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerAPI } from "../../services/api";
import { searchIndianBanks } from "../../data/indianBanks";
import "./ProviderPanel.css";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BusinessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M4 21V10.85M20 21V10.85M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
  </svg>
);

const LocationIcon = () => (
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

const UpiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BankVerificationStatus = ({ status }) => {
  const config = {
    pending: { class: "badge-warning", text: "Pending Verification" },
    verified: { class: "badge-success", text: "Verified" },
    rejected: { class: "badge-danger", text: "Rejected" }
  };
  const { class: badgeClass, text } = config[status] || config.pending;
  
  return <span className={`badge ${badgeClass}`}>{text}</span>;
};

export default function ProviderVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState(0);
  const [providerData, setProviderData] = useState(null);
  
  const [bankSearch, setBankSearch] = useState("");
  const [bankResults, setBankResults] = useState([]);

  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    businessAddress: { fullAddress: "", city: "", state: "", pincode: "" },
    bankDetails: {
      bankName: "",
      bankId: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      mobileNumber: ""
    },
    upiId: ""
  });

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
    } else {
      fetchVerification();
    }
  }, [navigate]);

  const fetchVerification = async () => {
    try {
      const res = await providerAPI.getProfile();
      if (res.data) {
        setProviderData(res.data);
        setVerification(res.data);
        setFormData({
          businessName: res.data.businessName || "",
          businessDescription: res.data.businessDescription || "",
          businessAddress: res.data.businessAddress || { fullAddress: "", city: "", state: "", pincode: "" },
          bankDetails: res.data.bankDetails || {
            bankName: "",
            bankId: "",
            accountNumber: "",
            ifscCode: "",
            accountHolderName: "",
            mobileNumber: ""
          },
          upiId: res.data.upiId || ""
        });
        if (res.data.bankDetails?.bankName) {
        }
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchBanks = useCallback(async (query) => {
    if (query.length < 3) {
      setBankResults([]);
      return;
    }
    
    try {
      const results = searchIndianBanks(query).map((name) => ({ name, id: name }));
      setBankResults(results.slice(0, 20));
    } catch (error) {
      console.error("Bank search error:", error);
      setBankResults([]);
    } finally {
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bankSearch) {
        searchBanks(bankSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [bankSearch, searchBanks]);

  const selectBank = (bank) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        bankName: bank.name,
        bankId: bank.id || bank.bank_id || ""
      }
    }));
    setBankSearch(bank.name);
    setBankResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bank.")) {
      const field = name.replace("bank.", "");
      setFormData(prev => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [field]: value }
      }));
    } else if (name.startsWith("address.")) {
      const field = name.replace("address.", "");
      setFormData(prev => ({
        ...prev,
        businessAddress: { ...prev.businessAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await providerAPI.updateProfile(formData);
      setMessage({ type: "success", text: "Profile saved successfully!" });
      fetchVerification();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const submitBankDetails = async () => {
    const { bankName, accountNumber, ifscCode, mobileNumber } = formData.bankDetails;
    
    if (!bankName || !accountNumber || !ifscCode) {
      setMessage({ type: "error", text: "Please fill in bank name, account number, and IFSC code" });
      return;
    }
    
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode)) {
      setMessage({ type: "error", text: "Please enter a valid IFSC code" });
      return;
    }
    
    if (!/^\d{9,18}$/.test(accountNumber)) {
      setMessage({ type: "error", text: "Please enter a valid account number" });
      return;
    }
    
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      setMessage({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await providerAPI.updateBankDetails(formData.bankDetails);
      setMessage({ type: "success", text: "Bank details submitted for verification!" });
      fetchVerification();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit bank details." });
    } finally {
      setSaving(false);
    }
  };

  const submitUpiDetails = async () => {
    if (!formData.upiId || !formData.upiId.includes('@')) {
      setMessage({ type: "error", text: "Please enter a valid UPI ID (e.g., yourname@upi)" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await providerAPI.updateUpiDetails({ upiId: formData.upiId });
      setMessage({ type: "success", text: "UPI details saved!" });
      fetchVerification();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save UPI details." });
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = () => {
    if (!verification) return { bg: "var(--bg-page)", color: "var(--text-muted)", text: "Not Started" };
    const configs = {
      pending: { bg: "var(--warning-bg)", color: "var(--warning)", text: "Pending Review" },
      approved: { bg: "var(--success-bg)", color: "var(--success)", text: "Verified" },
      rejected: { bg: "var(--danger-bg)", color: "var(--danger)", text: "Rejected" },
      partial: { bg: "#dbeafe", color: "#3b82f6", text: "Partially Complete" }
    };
    return configs[verification.verificationStatus] || configs.partial;
  };

  const getCompletionStats = () => {
    const hasBusinessInfo = !!(verification?.businessName || verification?.fullName);
    const hasAddress = !!(
      verification?.businessAddress?.city || 
      verification?.businessAddress?.state || 
      verification?.location?.city ||
      verification?.location?.state ||
      verification?.city ||
      verification?.state
    );
    const hasBankAccount = !!(
      verification?.bankDetails?.accountNumber || 
      verification?.bankAccountNumber
    );
    const hasUPI = !!(verification?.upiId || verification?.upiDetails?.upiId);
    
    const fields = [
      { label: "Business Info", complete: hasBusinessInfo },
      { label: "Address", complete: hasAddress },
      { label: "Bank Account", complete: hasBankAccount },
      { label: "UPI", complete: hasUPI }
    ];
    const completed = fields.filter(f => f.complete).length;
    return { fields, completed, percentage: Math.round((completed / fields.length) * 100) };
  };

  if (loading) {
    return (
      <div className="provider-layout">
        <ProviderSidebar providerData={null} />
        <main className="provider-main">
          <div className="provider-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = getStatusConfig();
  const stats = getCompletionStats();
  const bankStatus = verification?.bankDetails?.verificationStatus || 'pending';

  const tabs = [
    { id: 0, label: "Business", icon: <BusinessIcon /> },
    { id: 1, label: "Address", icon: <LocationIcon /> },
    { id: 2, label: "Bank Account", icon: <BankIcon /> },
    { id: 3, label: "UPI", icon: <UpiIcon /> }
  ];

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="page-title">Verification & Profile</h1>
              <p className="page-subtitle">Complete all fields to get verified</p>
            </div>
            <span className={`badge ${verification?.isApproved ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 16px', fontSize: '13px' }}>
              {statusConfig.text}
            </span>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
              <AlertIcon />
              {message.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            <div>
              <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                  <h3 className="card-title" style={{ marginBottom: '16px' }}>Completion Progress</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-page)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.percentage}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '14px', minWidth: '45px' }}>{stats.percentage}%</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {stats.fields.map((field) => (
                      <div key={field.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {field.complete ? (
                          <span style={{ color: 'var(--success)' }}><CheckIcon /></span>
                        ) : (
                          <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--border)' }}></span>
                        )}
                        <span style={{ fontSize: '13px', color: field.complete ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {field.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '4px', padding: '0 24px' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 20px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                        marginBottom: '-1px'
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="card-body">
                  {activeTab === 0 && (
                    <form onSubmit={handleSubmit}>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Enter your business information
                      </p>
                      <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          className="form-input"
                          value={formData.businessName}
                          onChange={handleChange}
                          placeholder="Enter your business or service name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Business Description</label>
                        <textarea
                          name="businessDescription"
                          className="form-textarea"
                          value={formData.businessDescription}
                          onChange={handleChange}
                          placeholder="Describe your services, experience, and specialties"
                          style={{ minHeight: '100px' }}
                        ></textarea>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                          {saving ? "Saving..." : "Save Business Info"}
                        </button>
                      </div>
                    </form>
                  )}

                  {activeTab === 1 && (
                    <form onSubmit={handleSubmit}>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Enter your business address
                      </p>
                      <div className="form-group">
                        <label className="form-label">Full Address</label>
                        <input
                          type="text"
                          name="address.fullAddress"
                          className="form-input"
                          value={formData.businessAddress.fullAddress}
                          onChange={handleChange}
                          placeholder="Street address, building, area"
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            name="address.city"
                            className="form-input"
                            value={formData.businessAddress.city}
                            onChange={handleChange}
                            placeholder="City"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            name="address.state"
                            className="form-input"
                            value={formData.businessAddress.state}
                            onChange={handleChange}
                            placeholder="State"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            name="address.pincode"
                            className="form-input"
                            value={formData.businessAddress.pincode}
                            onChange={handleChange}
                            placeholder="6-digit PIN"
                            maxLength={6}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                          {saving ? "Saving..." : "Save Address"}
                        </button>
                      </div>
                    </form>
                  )}

                  {activeTab === 2 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                          Add your bank account details for receiving payments
                        </p>
                        <BankVerificationStatus status={bankStatus} />
                      </div>

                      {/* Show existing bank details if saved */}
                      {(verification?.bankDetails?.accountNumber || verification?.bankAccountNumber) && (
                        <div className="card" style={{ marginBottom: '20px', background: 'var(--success-bg)', border: '1px solid var(--success)' }}>
                          <div className="card-body" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>
                                  ✓ Bank Account Saved
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                  {verification?.bankDetails?.bankName || verification?.bankName} • ****{String(verification?.bankDetails?.accountNumber || verification?.bankAccountNumber || '').slice(-4)}
                                </div>
                              </div>
                              <button 
                                type="button" 
                                className="btn btn-outline btn-sm"
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                onClick={async () => {
                                  if (window.confirm("Are you sure you want to remove bank account details?")) {
                                    try {
                                      await providerAPI.updateBankDetails({
                                        bankName: "",
                                        accountNumber: "",
                                        ifscCode: "",
                                        accountHolderName: "",
                                        mobileNumber: "",
                                        remove: true
                                      });
                                      fetchVerification();
                                    } catch (err) {
                                      setMessage({ type: "error", text: "Failed to remove bank details" });
                                    }
                                  }
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {bankStatus === 'rejected' && verification?.bankDetails?.rejectionReason && (
                        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                          <AlertIcon />
                          <div>
                            <strong>Rejection Reason:</strong> {verification.bankDetails.rejectionReason}
                          </div>
                        </div>
                      )}

                      <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label">Bank Name *</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={bankSearch}
                            onChange={(e) => {
                              setBankSearch(e.target.value);
                            }}
                            placeholder="Search for your bank..."
                            style={{ paddingRight: '40px' }}
                          />
                          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <SearchIcon />
                          </span>
                        </div>
                        
                        {bankResults.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            boxShadow: 'var(--shadow-lg)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 10,
                            marginTop: '4px'
                          }}>
                            {bankResults.map((bank, index) => (
                              <div
                                key={index}
                                onClick={() => selectBank(bank)}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  borderBottom: index < bankResults.length - 1 ? '1px solid var(--border-light)' : 'none',
                                  transition: 'background 0.15s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-page)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ fontWeight: '500', fontSize: '14px' }}>{bank.name}</div>
                                {bank.ifsc && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bank.ifsc}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Mobile Number *</label>
                          <input
                            type="tel"
                            name="bank.mobileNumber"
                            className="form-input"
                            value={formData.bankDetails.mobileNumber}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Account Holder Name *</label>
                          <input
                            type="text"
                            name="bank.accountHolderName"
                            className="form-input"
                            value={formData.bankDetails.accountHolderName}
                            onChange={handleChange}
                            placeholder="Name as per bank records"
                          />
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Account Number *</label>
                          <input
                            type="text"
                            name="bank.accountNumber"
                            className="form-input"
                            value={formData.bankDetails.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter account number"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">IFSC Code *</label>
                          <input
                            type="text"
                            name="bank.ifscCode"
                            className="form-input"
                            value={formData.bankDetails.ifscCode}
                            onChange={handleChange}
                            placeholder="e.g., SBIN0001234"
                            style={{ textTransform: 'uppercase' }}
                            maxLength={11}
                          />
                        </div>
                      </div>

                      {bankStatus !== 'verified' && (
                        <div className="alert alert-info" style={{ marginTop: '16px' }}>
                          <AlertIcon />
                          <span>Your bank details will be verified by our team within 24-48 hours.</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={submitBankDetails}
                          disabled={saving || bankStatus === 'verified'}
                        >
                          {saving ? "Submitting..." : bankStatus === 'pending' ? "Submit for Verification" : "Update Bank Details"}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Add UPI for instant payouts (optional)
                      </p>

                      {/* Show existing UPI if saved */}
                      {(verification?.upiId || verification?.upiDetails?.upiId) && (
                        <div className="card" style={{ marginBottom: '20px', background: 'var(--success-bg)', border: '1px solid var(--success)' }}>
                          <div className="card-body" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>
                                  ✓ UPI ID Saved
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                  {verification?.upiId || verification?.upiDetails?.upiId}
                                </div>
                              </div>
                              <button 
                                type="button" 
                                className="btn btn-outline btn-sm"
                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                onClick={async () => {
                                  if (window.confirm("Are you sure you want to remove UPI ID?")) {
                                    try {
                                      await providerAPI.updateUpiDetails({ upiId: "", remove: true });
                                      fetchVerification();
                                    } catch (err) {
                                      setMessage({ type: "error", text: "Failed to remove UPI" });
                                    }
                                  }
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">UPI ID</label>
                        <input
                          type="text"
                          name="upiId"
                          className="form-input"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="e.g., yourname@upi or yourname@okicici"
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="button" className="btn btn-primary" onClick={submitUpiDetails} disabled={saving}>
                          {saving ? "Saving..." : "Save UPI Details"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ position: 'sticky', top: '32px' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '600' }}>
                      {verification?.businessName?.[0]?.toUpperCase() || verification?.fullName?.[0]?.toUpperCase() || "P"}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>
                        {verification?.businessName || verification?.fullName || "Provider"}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {verification?.email || "Email not set"}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '16px 0', margin: '16px 0' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{verification?.phone || "Not provided"}</div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Verification Status</div>
                      <span className={`badge ${verification?.isApproved ? 'badge-success' : 'badge-warning'}`}>
                        {statusConfig.text}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Bank Status</div>
                      <BankVerificationStatus status={bankStatus} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Quick Stats</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-page)', borderRadius: 'var(--radius)' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{verification?.servicesCount || 0}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Services</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-page)', borderRadius: 'var(--radius)' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>{verification?.bookingsCount || 0}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bookings</div>
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
