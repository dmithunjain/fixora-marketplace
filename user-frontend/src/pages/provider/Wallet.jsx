import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { walletAPI, providerAPI } from "../../services/api";
import { searchIndianBanks } from "../../data/indianBanks";
import "./ProviderPanel.css";

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
  </svg>
);



const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);


const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function Wallet() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [providerData, setProviderData] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankId: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    mobileNumber: "",
    upiId: ""
  });
  const [bankSearchResults, setBankSearchResults] = useState([]);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalSlip, setWithdrawalSlip] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadWalletData();
  }, [navigate]);

  const loadWalletData = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);
      
      try {
        const profileRes = await providerAPI.getProfile();
        if (profileRes.data) {
          setProviderData(profileRes.data);
          localStorage.setItem("providerData", JSON.stringify(profileRes.data));
        }
        if (profileRes.data?.bankDetails) {
          setBankForm({
            bankName: profileRes.data.bankDetails.bankName || "",
            bankId: profileRes.data.bankDetails.bankId || "",
            accountNumber: profileRes.data.bankDetails.accountNumber || "",
            ifscCode: profileRes.data.bankDetails.ifscCode || "",
            accountHolderName: profileRes.data.bankDetails.accountHolderName || profileRes.data.bankDetails.accountName || "",
            mobileNumber: profileRes.data.bankDetails.mobileNumber || "",
            upiId: profileRes.data.upiDetails?.upiId || ""
          });
        }
      } catch (profileErr) {
        console.log("Profile load error:", profileErr);
      }
      
      try {
        const walletRes = await walletAPI.getWallet();
        if (walletRes.data) {
          setWalletData({
            balance: walletRes.data.balance || 0,
            totalEarnings: walletRes.data.totalEarnings || 0,
            pendingBalance: walletRes.data.pendingBalance || 0,
            pendingEarnings: walletRes.data.pendingBalance || 0
          });
        }
      } catch (walletErr) {
        console.log("Wallet data error:", walletErr);
        setWalletData({ balance: 0, totalEarnings: 0, pendingBalance: 0, pendingEarnings: 0 });
      }

      // Fetch withdrawal history
      try {
        const withdrawRes = await walletAPI.getWithdrawals();
        setWithdrawals(withdrawRes.data || []);
      } catch (withdrawErr) {
        console.log("Withdrawals error:", withdrawErr);
      }
    } catch (err) {
      console.log("Wallet data error:", err);
      setWalletData({ balance: 0, totalEarnings: 0, pendingEarnings: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSlip = async (withdrawalId) => {
    try {
      const response = await walletAPI.getWithdrawalSlip(withdrawalId);
      setWithdrawalSlip(response.data);
    } catch (error) {
      console.error('Error fetching withdrawal slip:', error);
      alert('Failed to load withdrawal details');
    } finally {
    }
  };

  const printSlip = () => {
    const printContent = document.getElementById('withdrawal-slip-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Withdrawal Receipt - ${withdrawalSlip?.withdrawalId?.slice(-8).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; background: #fff; }
            .slip-container { border: 3px solid #4f46e5; border-radius: 8px; overflow: hidden; }
            .slip-header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; color: white; }
            .slip-header h2 { margin: 0; font-size: 28px; font-weight: bold; }
            .slip-header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
            .slip-body { padding: 24px; }
            .info-box { background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
            .info-box table { width: 100%; border-collapse: collapse; }
            .info-box td { padding: 8px 0; }
            .info-box td:first-child { color: #666; font-size: 14px; }
            .info-box td:last-child { text-align: right; font-weight: 500; font-size: 14px; }
            .section-title { font-size: 14px; color: #666; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; font-weight: 600; }
            .credit-box { background: #f0fdf4; padding: 16px; border-radius: 8px; border: 1px solid #bbf7d0; margin-bottom: 20px; }
            .credit-box .bank-name { font-weight: 600; color: #166534; margin-bottom: 4px; }
            .credit-box .acc-detail { font-size: 14px; color: #166534; }
            .amount-box { background: #f5f3ff; padding: 16px; border-radius: 8px; border: 1px solid #e0e7ff; }
            .amount-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .amount-row.gross { color: #666; }
            .amount-row.commission { color: #ef4444; }
            .amount-row.total { border-top: 1px solid #c7d2fe; padding-top: 12px; margin-top: 12px; }
            .amount-row.total span:first-child { font-weight: bold; font-size: 16px; }
            .amount-row.total span:last-child { font-weight: bold; font-size: 18px; color: #10b981; }
            .slip-footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            @media print { 
              body { padding: 0; }
              .slip-container { border-width: 2px; }
            }
          </style>
        </head>
        <body>
          <div class="slip-container">
            <div class="slip-header">
              <h2>Fixora</h2>
              <p>Withdrawal Receipt</p>
            </div>
            <div class="slip-body">
              <div class="info-box">
                <table>
                  <tr>
                    <td>Receipt No.</td>
                    <td>WDR-${withdrawalSlip?.withdrawalId?.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Provider Name</td>
                    <td>${withdrawalSlip?.providerName}</td>
                  </tr>
                  <tr>
                    <td>Request Date</td>
                    <td>${new Date(withdrawalSlip?.requestDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>Processed Date</td>
                    <td>${withdrawalSlip?.processedDate ? new Date(withdrawalSlip?.processedDate).toLocaleDateString() : '—'}</td>
                  </tr>
                </table>
              </div>
              
              <div class="section-title">Credit To</div>
              <div class="credit-box">
                ${withdrawalSlip?.bankDetails?.bankName ? `
                  <div class="bank-name">${withdrawalSlip?.bankDetails?.bankName}</div>
                  <div class="acc-detail">A/C: ${withdrawalSlip?.bankDetails?.accountNumber?.slice(0, 4)}****${withdrawalSlip?.bankDetails?.accountNumber?.slice(-4)}</div>
                  <div class="acc-detail">IFSC: ${withdrawalSlip?.bankDetails?.ifscCode}</div>
                ` : `
                  <div class="bank-name">UPI</div>
                  <div class="acc-detail">${withdrawalSlip?.upiId}</div>
                `}
              </div>
              
              <div class="section-title">Amount Details</div>
              <div class="amount-box">
                <div class="amount-row gross">
                  <span>Gross Amount</span>
                  <span>₹${withdrawalSlip?.grossAmount?.toLocaleString()}</span>
                </div>
                <div class="amount-row commission">
                  <span>Fixora Commission (${withdrawalSlip?.commissionPercent}%)</span>
                  <span>- ₹${withdrawalSlip?.commission?.toLocaleString()}</span>
                </div>
                <div class="amount-row total">
                  <span>Net Amount Credited</span>
                  <span>₹${withdrawalSlip?.netAmount?.toLocaleString()}</span>
                </div>
              </div>
              
              <div class="slip-footer">
                This is a computer-generated receipt. No signature required.<br/>
                Thank you for using Fixora!
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

   const searchBanks = async (query) => {
    if (query.length < 2) {
      setBankSearchResults([]);
      return;
    }
    try {
      const results = searchIndianBanks(query).map((name) => ({ BANK: name, IFSC: '', BRANCH: 'Select IFSC manually', CITY: '' }));
      setBankSearchResults(results);
    } catch (error) {
      console.log("Bank search error:", error);
      setBankSearchResults([]);
    } finally {
    }
  };

  const handleBankSearchChange = (e) => {
    const value = e.target.value;
    setBankForm({ ...bankForm, bankName: value });
    
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      searchBanks(value);
    }, 300);
    setSearchTimeout(timeout);
  };

  const handleIfscChange = (e) => {
    setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() });
  };

  const selectBank = (bank) => {
    setBankForm({
      ...bankForm,
      bankName: bank.BANK,
      ifscCode: bank.IFSC || bankForm.ifscCode || ""
    });
    setBankSearchResults([]);
    setShowBankDropdown(false);
  };

  const saveBankDetails = async () => {
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.ifscCode || !bankForm.mobileNumber || !bankForm.upiId) {
      setMessage({ type: "error", text: "Please fill bank name, account number, IFSC, mobile number, and UPI ID" });
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(bankForm.ifscCode)) {
      setMessage({ type: "error", text: "Please enter a valid IFSC code" });
      return;
    }
    if (!/^\d{9,18}$/.test(bankForm.accountNumber)) {
      setMessage({ type: "error", text: "Please enter a valid account number" });
      return;
    }
    if (!/^\d{10}$/.test(bankForm.mobileNumber)) {
      setMessage({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }
    if (!/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/i.test(bankForm.upiId)) {
      setMessage({ type: "error", text: "Please enter a valid UPI ID (example: name@bank)" });
      return;
    }

    setSavingBank(true);
    try {
      const response = await providerAPI.updateBankDetails(bankForm);
      
      const updatedProvider = { ...providerData, bankDetails: response.data?.bankDetails || bankForm };
      setProviderData(updatedProvider);
      localStorage.setItem("providerData", JSON.stringify(updatedProvider));
      
      setMessage({ type: "success", text: "Bank and UPI details submitted. Verification is in process." });
      setShowBankModal(false);
      loadWalletData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save bank details. Please try again." });
    } finally {
      setSavingBank(false);
    }
  };

  const handleWithdraw = () => {
    const bankVerified = providerData?.bankDetails?.isVerified;
    if (!bankVerified) {
      setMessage({ type: "error", text: "Please complete bank verification first. Verification is in process until admin approval." });
      return;
    }
    setWithdrawAmount("");
    setWithdrawModalOpen(true);
  };

  const submitWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }
    
    if (amount > (walletData?.balance || 0)) {
      setMessage({ type: "error", text: "Insufficient balance. You can only withdraw up to ₹" + (walletData?.balance || 0).toLocaleString() });
      return;
    }
    
    if (amount < 100) {
      setMessage({ type: "error", text: "Minimum withdrawal amount is ₹100" });
      return;
    }

    setWithdrawLoading(true);
    try {
      const paymentMethod = bankForm.upiId ? 'upi' : 'bank_transfer';
      await walletAPI.requestWithdrawal({
        amount,
        paymentMethod,
        bankDetails: paymentMethod === 'bank_transfer' ? {
          bankName: bankForm.bankName,
          accountNumber: bankForm.accountNumber,
          ifscCode: bankForm.ifscCode,
          accountHolderName: bankForm.accountHolderName
        } : undefined,
        upiId: paymentMethod === 'upi' ? bankForm.upiId : undefined
      });
      
      setMessage({ type: "success", text: "Withdrawal request submitted successfully! It will be processed after admin approval." });
      setWithdrawModalOpen(false);
      loadWalletData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to submit withdrawal request. Please try again." });
    } finally {
      setWithdrawLoading(false);
    }
  };

  const getBankStatusBadge = () => {
    const status = providerData?.bankDetails?.verificationStatus;
    if (!providerData?.bankDetails?.accountNumber) {
      return <span className="badge badge-danger">Not Added</span>;
    }
    if (status === "verified") {
      return <span className="badge badge-success">Verified</span>;
    }
    if (status === "rejected") {
      return <span className="badge badge-danger">Rejected</span>;
    }
    return <span className="badge badge-warning">Pending</span>;
  };

  const maskedAccountNumber = (accNo) => {
    if (!accNo) return "N/A";
    return accNo.slice(0, 4) + "****" + accNo.slice(-4);
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

  const canReceivePayments = !!providerData?.bankDetails?.isVerified;
  const missingBankFields = [
    !bankForm.bankName && "Bank Name",
    !bankForm.accountNumber && "Account Number",
    !bankForm.ifscCode && "IFSC Code",
    !bankForm.mobileNumber && "Mobile Number",
    !bankForm.upiId && "UPI ID"
  ].filter(Boolean);

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header">
            <h1 className="page-title">Wallet & Earnings</h1>
            <p className="page-subtitle">Track your earnings and manage withdrawals</p>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "error" ? "alert-danger" : message.type === "success" ? "alert-success" : "alert-info"}`}>
              {message.text}
            </div>
          )}

          {/* Stats Cards */}
          <div className="wallet-stats-grid">
            <div className="wallet-balance-card">
              <h3>Available Balance</h3>
              <div className="balance-amount">₹{walletData?.balance?.toLocaleString() || "0"}</div>
              <button 
                className="btn" 
                onClick={handleWithdraw}
                disabled={!providerData?.bankDetails?.isVerified}
              >
                <DownloadIcon />
                Withdraw Funds
              </button>
            </div>

            <div className="wallet-earning-card">
              <h3>Total Earnings</h3>
              <div className="amount">₹{walletData?.totalEarnings?.toLocaleString() || "0"}</div>
            </div>

            <div className="wallet-earning-card pending">
              <h3>Pending Earnings</h3>
              <div className="amount">₹{walletData?.pendingEarnings?.toLocaleString() || "0"}</div>
            </div>
          </div>

          {/* Bank Account Card */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex align-items-center gap-2">
                <BankIcon />
                <h3 className="card-title mb-0">Bank Account</h3>
                {getBankStatusBadge()}
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowBankModal(true)}
              >
                {providerData?.bankDetails?.accountNumber ? "Edit Bank Details" : "Add Bank Account"}
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                {canReceivePayments ? (
                  <div className="alert alert-success mb-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Eligible to receive payments from users.
                  </div>
                ) : (
                  <div className="alert alert-info mb-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Verification is in process. You can receive payments after admin approval.
                  </div>
                )}
              </div>
              {providerData?.bankDetails?.accountNumber ? (
                <div className="wallet-bank-details">
                  <div className="wallet-bank-field">
                    <label>Bank Name</label>
                    <span>{providerData.bankDetails.bankName}</span>
                  </div>
                  <div className="wallet-bank-field">
                    <label>Account Number</label>
                    <span>{maskedAccountNumber(providerData.bankDetails.accountNumber)}</span>
                  </div>
                  <div className="wallet-bank-field">
                    <label>IFSC Code</label>
                    <span>{providerData.bankDetails.ifscCode}</span>
                  </div>
                  <div className="wallet-bank-field">
                    <label>Account Holder</label>
                    <span>{providerData.bankDetails.accountHolderName || "N/A"}</span>
                  </div>
                  <div className="wallet-bank-field">
                    <label>Mobile Number</label>
                    <span>{providerData.bankDetails.mobileNumber || "N/A"}</span>
                  </div>
                  <div className="wallet-bank-field">
                    <label>UPI ID</label>
                    <span>{providerData.upiDetails?.upiId || bankForm.upiId || "N/A"}</span>
                  </div>
                  {providerData.bankDetails.verificationStatus === "rejected" && providerData.bankDetails.rejectionReason && (
                    <div className="alert alert-danger mt-3">
                      <strong>Rejection Reason:</strong> {providerData.bankDetails.rejectionReason}
                    </div>
                  )}
                </div>
              ) : (
                <div className="wallet-empty">
                  <BankIcon />
                  <h4>No Bank Account Added</h4>
                  <p>Add your bank account to receive withdrawals</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => setShowBankModal(true)}
                  >
                    Add Bank Account
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Withdrawal History</h3>
            </div>
            <div className="card-body p-0">
              {withdrawals.length === 0 ? (
                <div className="wallet-empty">
                  <WalletIcon />
                  <h4>No withdrawal requests</h4>
                  <p>Your withdrawal history will appear here</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Gross Amount</th>
                        <th>Commission (30%)</th>
                        <th>Net Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td>{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold">₹{withdrawal.amount?.toLocaleString()}</td>
                          <td className="text-danger">₹{(withdrawal.commission || Math.round(withdrawal.amount * 0.3))?.toLocaleString()}</td>
                          <td className="fw-bold text-success">₹{withdrawal.netAmount?.toLocaleString() || '—'}</td>
                          <td>{withdrawal.paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer'}</td>
                          <td>
                            <span className={`badge ${
                              withdrawal.status === 'completed' ? 'badge-success' : 
                              withdrawal.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td>
                            {withdrawal.status === 'completed' && (
                              <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => handleDownloadSlip(withdrawal._id)}
                              >
                                <DownloadIcon />
                                Slip
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bank Modal */}
      {showBankModal && (
        <div className="dialog-overlay" onClick={() => setShowBankModal(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Bank Account Details</h3>
              <button className="dialog-close" onClick={() => setShowBankModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-body">
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type bank name (e.g., State Bank of India)"
                    value={bankForm.bankName}
                    onChange={handleBankSearchChange}
                    onFocus={() => bankForm.bankName.length >= 2 && setShowBankDropdown(true)}
                  />
                  {showBankDropdown && bankSearchResults.length > 0 && (
                    <div className="bank-search-dropdown">
                      {bankSearchResults.map((bank, index) => (
                        <div 
                          key={index}
                          className="bank-search-item"
                          onClick={() => selectBank(bank)}
                        >
                          <span className="fw-semibold">{bank.BANK}</span>
                          {bank.IFSC && <span className="text-primary">{bank.IFSC}</span>}
                          <small className="text-muted">{bank.BRANCH}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <label className="form-label">Account Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter account number"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                      maxLength={18}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <label className="form-label">IFSC Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., SBIN0001234"
                      value={bankForm.ifscCode}
                      onChange={handleIfscChange}
                      maxLength={11}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <label className="form-label">Account Holder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name as per bank records"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Linked to bank account"
                      value={bankForm.mobileNumber}
                      onChange={(e) => setBankForm({ ...bankForm, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mt-3 mb-0">
                <label className="form-label">UPI ID *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="example@bank"
                  value={bankForm.upiId}
                  onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value.trim() })}
                />
              </div>

              <div className="alert alert-info mt-3 mb-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Your bank details will be verified by our admin team. Please ensure all information is accurate.</span>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setShowBankModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveBankDetails} disabled={savingBank}>
                {savingBank ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
            {missingBankFields.length > 0 && (
              <div className="px-3 pb-3">
                <small className="text-warning">Please complete: {missingBankFields.join(', ')}</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="dialog-overlay" onClick={() => setWithdrawModalOpen(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Withdraw Funds</h3>
              <button className="dialog-close" onClick={() => setWithdrawModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">Available Balance</label>
                  <span className="fw-bold text-success fs-5">₹{walletData?.balance?.toLocaleString() || "0"}</span>
                </div>
                <label className="form-label">Withdrawal Amount *</label>
                <div className="position-relative">
                  <span className="position-absolute" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 500 }}>₹</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: 32 }}
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                  <small className="text-muted mt-1 d-block">
                    After withdrawal: ₹{((walletData?.balance || 0) - parseFloat(withdrawAmount)).toLocaleString()}
                  </small>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Payment Method</label>
                <div className="d-flex gap-2">
                  {bankForm.upiId && (
                    <div className="payment-method-card flex-fill">
                      <div className="text-muted fs-sm">UPI</div>
                      <div className="fw-semibold">{bankForm.upiId}</div>
                    </div>
                  )}
                  {bankForm.accountNumber && (
                    <div className="payment-method-card flex-fill">
                      <div className="text-muted fs-sm">Bank Transfer</div>
                      <div className="fw-semibold">{maskedAccountNumber(bankForm.accountNumber)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="alert alert-warning mb-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Withdrawal requests are processed by admin. Amount will be credited to your {bankForm.upiId ? 'UPI' : 'bank'} account after approval.</span>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setWithdrawModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitWithdrawal} disabled={withdrawLoading || !withdrawAmount}>
                {withdrawLoading ? "Processing..." : "Request Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Slip Modal */}
      {withdrawalSlip && (
        <div className="dialog-overlay" onClick={() => setWithdrawalSlip(null)}>
          <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="dialog-header">
              <h3>Withdrawal Receipt</h3>
              <button className="dialog-close" onClick={() => setWithdrawalSlip(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-body p-0" id="withdrawal-slip-content" style={{ background: '#fff' }}>
              <div style={{ 
                border: '3px solid #4f46e5', 
                borderRadius: '8px', 
                overflow: 'hidden',
                margin: '16px'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                  padding: '24px', 
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Fixora</h2>
                  <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px' }}>Withdrawal Receipt</p>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#666', fontSize: '14px' }}>Receipt No.</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>WDR-{withdrawalSlip.withdrawalId?.slice(-8).toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#666', fontSize: '14px' }}>Provider Name</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '500', fontSize: '14px' }}>{withdrawalSlip.providerName}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#666', fontSize: '14px' }}>Request Date</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontSize: '14px' }}>{new Date(withdrawalSlip.requestDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', color: '#666', fontSize: '14px' }}>Processed Date</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontSize: '14px' }}>{withdrawalSlip.processedDate ? new Date(withdrawalSlip.processedDate).toLocaleDateString() : '—'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Credit To</h4>
                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '20px' }}>
                    {withdrawalSlip.bankDetails?.bankName ? (
                      <>
                        <div style={{ fontWeight: '600', color: '#166534', marginBottom: '4px' }}>{withdrawalSlip.bankDetails.bankName}</div>
                        <div style={{ fontSize: '14px', color: '#166534' }}>A/C: {withdrawalSlip.bankDetails.accountNumber?.slice(0, 4)}****{withdrawalSlip.bankDetails.accountNumber?.slice(-4)}</div>
                        <div style={{ fontSize: '14px', color: '#166534' }}>IFSC: {withdrawalSlip.bankDetails.ifscCode}</div>
                      </>
                    ) : (
                      <div style={{ fontWeight: '600', color: '#166534' }}>UPI: {withdrawalSlip.upiId}</div>
                    )}
                  </div>

                  <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Amount Details</h4>
                  <div style={{ background: '#f5f3ff', padding: '16px', borderRadius: '8px', border: '1px solid #e0e7ff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#666' }}>Gross Amount</span>
                      <span style={{ fontWeight: '600' }}>₹{withdrawalSlip.grossAmount?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444' }}>
                      <span>Fixora Commission ({withdrawalSlip.commissionPercent}%)</span>
                      <span>- ₹{withdrawalSlip.commission?.toLocaleString()}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #c7d2fe', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Net Amount Credited</span>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#10b981' }}>₹{withdrawalSlip.netAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '20px', marginBottom: 0 }}>
                    This is a computer-generated receipt. No signature required.<br/>
                    Thank you for using Fixora!
                  </p>
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setWithdrawalSlip(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={printSlip}>
                <DownloadIcon /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
